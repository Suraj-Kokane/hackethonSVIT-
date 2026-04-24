/* ── Narrative Explanation Component ──────────────────────── */
import ReactMarkdown from "react-markdown";
import { FiInfo } from "react-icons/fi";

interface NarrativeExplanationProps {
  explanation: string;
}

export default function NarrativeExplanation({ explanation }: NarrativeExplanationProps) {
  if (!explanation) return null;

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
          borderBottom: "1px solid var(--border-color)",
          background: "rgba(34, 211, 238, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiInfo size={18} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 600, fontSize: "14px" }}>💡 Interpretable Narrative</span>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "20px",
          fontSize: "15px",
          lineHeight: "1.7",
          color: "var(--text-secondary)",
        }}
      >
        <ReactMarkdown>{explanation}</ReactMarkdown>
      </div>
    </div>
  );
}
