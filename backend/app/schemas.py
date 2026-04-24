"""
Pydantic schemas for request / response validation.
"""
from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, Optional


# ── Request ──────────────────────────────────────────────
class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=4000, description="The user's question")
    explainability: bool = Field(True, description="Toggle explainability on/off")
    conversation_id: Optional[str] = Field(None, description="Optional conversation ID for log retrieval")


# ── Causal Trace ─────────────────────────────────────────
class CausalTrace(BaseModel):
    influential_input_tokens: List[str] = []
    key_reasoning_steps: List[int] = []
    explanation: str = ""


# ── Evaluation Metrics ───────────────────────────────────
class EvalMetrics(BaseModel):
    faithfulness: float = Field(0.0, ge=0.0, le=1.0)
    interpretability: float = Field(0.0, ge=0.0, le=1.0)
    completeness: float = Field(0.0, ge=0.0, le=1.0)
    transparency: float = Field(0.0, ge=0.0, le=1.0)


# ── Transparency Report ──────────────────────────────────
class TransparencyReport(BaseModel):
    logical_basis: str = Field(..., description="The fundamental logic or framework used to derive the answer")
    data_provenance: str = Field(..., description="The type of knowledge or data sources the model relied on")
    limitations: List[str] = Field(default_factory=list, description="Specific constraints or gaps in the model's current knowledge for this query")


# ── Full Response ────────────────────────────────────────
class QueryResponse(BaseModel):
    answer: str
    explanation: str = ""
    reasoning: List[str] = []  # Standardized to reasoning
    causal_trace: Optional[CausalTrace] = None
    confidence: float = Field(0.0, ge=0.0, le=1.0)
    bias_warnings: List[str] = []
    transparency_report: Optional[TransparencyReport] = None
    evaluation: Optional[EvalMetrics] = None
    conversation_id: str = ""


# ── Conversation Log Entry ───────────────────────────────
class ConversationEntry(BaseModel):
    id: str
    query: str
    response: QueryResponse
    timestamp: str
