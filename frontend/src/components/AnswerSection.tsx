/* ── Answer Section Component ──────────────────────────── */
import ReactMarkdown from "react-markdown";
import { FiCheckCircle } from "react-icons/fi";

interface AnswerSectionProps {
  answer: string;
  confidence: number;
}

function getConfidenceColor(c: number): string {
  if (c >= 0.8) return "var(--accent-emerald)";
  if (c >= 0.5) return "var(--accent-amber)";
  return "var(--accent-rose)";
}

function getConfidenceLabel(c: number): string {
  if (c >= 0.8) return "High";
  if (c >= 0.5) return "Medium";
  return "Low";
}

export default function AnswerSection({ answer, confidence }: AnswerSectionProps) {
  const color = getConfidenceColor(confidence);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
      className="animate-fade-in-up"
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-color)",
          background: "rgba(99, 102, 241, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiCheckCircle size={18} color="var(--accent-emerald)" />
          <span style={{ fontWeight: 600, fontSize: "14px" }}>🧾 Final Answer</span>
        </div>

        {/* Confidence Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 12px",
            borderRadius: "9999px",
            background: `${color}15`,
            border: `1px solid ${color}40`,
            fontSize: "12px",
            fontWeight: 600,
            color,
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: color,
            }}
          />
          {(confidence * 100).toFixed(0)}% — {getConfidenceLabel(confidence)}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "20px",
          fontSize: "15px",
          lineHeight: "1.7",
          color: "var(--text-primary)",
        }}
        className="prose-content"
      >
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </div>
  );
}
