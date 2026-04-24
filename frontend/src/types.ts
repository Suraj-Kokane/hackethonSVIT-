/* ── API Types — mirrors the backend Pydantic schemas ── */

export interface CausalTrace {
  influential_input_tokens: string[];
  key_reasoning_steps: number[];
  explanation: string;
}

export interface EvalMetrics {
  faithfulness: number;
  interpretability: number;
  completeness: number;
  transparency: number;
}

export interface TransparencyReport {
  logical_basis: string;
  data_provenance: string;
  limitations: string[];
}

export interface QueryResponse {
  answer: string;
  explanation: string;
  reasoning: string[];
  causal_trace: CausalTrace | null;
  confidence: number;
  bias_warnings: string[];
  transparency_report: TransparencyReport | null;
  evaluation: EvalMetrics | null;
  image_url?: string | null;
  conversation_id: string;
}

export interface ConversationEntry {
  id: string;
  query: string;
  response: QueryResponse;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: QueryResponse;
  timestamp: Date;
}
