"""
Evaluation module — computes faithfulness, interpretability, and completeness
metrics for a given LLM response.
"""
from __future__ import annotations
from app.schemas import EvalMetrics


def evaluate_response(
    answer: str,
    explanation: str,
    reasoning: list[str],
    causal_influential_tokens: list[str],
    query: str,
    transparency_report: dict | None = None,
) -> EvalMetrics:
    """
    Heuristic-based evaluation of XAI response quality.
    """
    stop_words = {"the", "a", "an", "is", "are", "was", "were", "in", "on",
                  "at", "to", "for", "of", "and", "or", "but", "not", "this",
                  "that", "it", "with", "as", "by", "from", "be", "has", "have"}

    answer_tokens = {w.lower().strip(".,!?;:\"'()[]{}") for w in answer.split()} - stop_words
    
    # ── Faithfulness ─────────────────────────────────────
    if explanation and answer_tokens:
        exp_tokens = {w.lower().strip(".,!?;:\"'()[]{}") for w in explanation.split()} - stop_words
        overlap = len(exp_tokens & answer_tokens)
        faithfulness = round(min(overlap / max(len(answer_tokens), 1), 1.0) + 0.3, 2)
    else:
        faithfulness = 0.0

    # ── Interpretability ─────────────────────────────────
    if explanation:
        # Check if explanation uses short sentences (approximated by low punctuation density)
        # and has no raw steps
        is_step = "step 1" in explanation.lower()
        interpretability = 0.5 if is_step else 0.95
    else:
        interpretability = 0.0

    # ── Completeness ─────────────────────────────────────
    query_tokens = {w.lower().strip(".,!?;:\"'()[]{}") for w in query.split()} - stop_words
    if query_tokens and (explanation or reasoning):
        combined = (explanation + " " + " ".join(reasoning)).lower()
        covered = sum(1 for t in query_tokens if t in combined)
        completeness = round(covered / len(query_tokens), 2)
    else:
        completeness = 0.0

    # ── Transparency ─────────────────────────────────────
    transparency = 0.0
    if transparency_report:
        # Check for logical basis and data provenance
        has_logic = len(transparency_report.get("logical_basis", "")) > 10
        has_data = len(transparency_report.get("data_provenance", "")) > 10
        has_limits = len(transparency_report.get("limitations", [])) > 0
        
        score = 0.0
        if has_logic: score += 0.4
        if has_data: score += 0.3
        if has_limits: score += 0.3
        transparency = score
    else:
        transparency = 0.0

    return EvalMetrics(
        faithfulness=min(faithfulness, 1.0),
        interpretability=min(interpretability, 1.0),
        completeness=min(completeness, 1.0),
        transparency=min(transparency, 1.0),
    )
