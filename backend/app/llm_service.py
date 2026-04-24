"""
LLM service — communicates with Groq and parses structured output.
Explanation is generated WITH the answer (dual output pipeline).
"""
from __future__ import annotations

import datetime
import json
import logging
import re
import time
from groq import Groq

from app.config import API_KEY, MODEL_NAME
from app.prompts import SYSTEM_PROMPT, SYSTEM_PROMPT_NO_EXPLAIN
from app.schemas import QueryResponse, CausalTrace
from app.evaluation import evaluate_response

logger = logging.getLogger(__name__)

# Configure Groq client
client = Groq(api_key=API_KEY)

# Retry settings for rate-limit errors
MAX_RETRIES = 3
INITIAL_BACKOFF_SECONDS = 5


def _parse_json_response(text: str) -> dict:
    """
    Extract the first valid JSON object from the LLM's response text.
    Handles markdown code fences and leading/trailing noise.
    """
    # Strip markdown fences if present
    cleaned = re.sub(r"```(?:json)?", "", text).strip("`").strip()

    # Try direct parse first
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Fallback: find first { ... } block
    match = re.search(r"\{[\s\S]*\}", cleaned)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    return {}


def _call_groq_with_retry(system_prompt: str, query: str) -> str:
    """
    Call the Groq API with automatic retry + exponential backoff
    for 429 rate-limit errors.
    """
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query},
                ],
                temperature=0.7,
                max_tokens=4096,
            )
            return response.choices[0].message.content
        except Exception as exc:
            error_str = str(exc)
            is_rate_limit = "429" in error_str or "rate" in error_str.lower() or "quota" in error_str.lower()
            if is_rate_limit and attempt < MAX_RETRIES:
                wait = INITIAL_BACKOFF_SECONDS * (2 ** (attempt - 1))
                logger.warning(f"Rate-limited (attempt {attempt}/{MAX_RETRIES}). Retrying in {wait}s...")
                time.sleep(wait)
            else:
                raise


def generate_response(query: str, explainability: bool = True) -> QueryResponse:
    """
    Generate an answer with optional explainability in a SINGLE generation call.
    This is NOT a post-hoc explanation — reasoning is produced simultaneously.
    """
    system_prompt = SYSTEM_PROMPT if explainability else SYSTEM_PROMPT_NO_EXPLAIN
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    system_prompt = system_prompt.replace("{{CURRENT_DATE}}", current_date)

    # Single generation call with retry — answer + reasoning produced together
    raw_text = _call_groq_with_retry(system_prompt, query)

    data = _parse_json_response(raw_text)

    if not data:
        # Graceful fallback — return the raw text as the answer
        return QueryResponse(
            answer=raw_text.strip(),
            reasoning=["Unable to parse structured response from model."],
            confidence=0.3,
        )

    answer = data.get("answer", raw_text.strip())
    explanation = data.get("explanation", "")
    reasoning = data.get("reasoning", [])
    causal_raw = data.get("causal_trace", {})
    transparency_raw = data.get("transparency_report", {})
    confidence = float(data.get("confidence", 0.5))
    bias_warnings = data.get("bias_warnings", [])

    causal_trace = None
    if explainability and causal_raw:
        causal_trace = CausalTrace(
            influential_input_tokens=causal_raw.get("influential_input_tokens", []),
            key_reasoning_steps=causal_raw.get("key_reasoning_steps", []),
            explanation=causal_raw.get("explanation", ""),
        )

    from app.schemas import TransparencyReport
    transparency_report = None
    if explainability and transparency_raw:
        transparency_report = TransparencyReport(
            logical_basis=transparency_raw.get("logical_basis", "N/A"),
            data_provenance=transparency_raw.get("data_provenance", "N/A"),
            limitations=transparency_raw.get("limitations", []),
        )

    # Compute evaluation metrics
    evaluation = None
    if explainability:
        influential = causal_trace.influential_input_tokens if causal_trace else []
        evaluation = evaluate_response(
            answer, 
            explanation, 
            reasoning, 
            influential, 
            query,
            transparency_raw if explainability else None
        )

    return QueryResponse(
        answer=answer,
        explanation=explanation,
        reasoning=reasoning if explainability else [],
        causal_trace=causal_trace,
        confidence=confidence,
        bias_warnings=bias_warnings if explainability else [],
        transparency_report=transparency_report,
        evaluation=evaluation,
    )
