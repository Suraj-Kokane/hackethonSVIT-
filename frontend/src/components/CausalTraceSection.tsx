/* ── Causal Trace Component ────────────────────────────── */
import type { CausalTrace } from "../types";

interface CausalTraceSectionProps {
  trace: CausalTrace;
  originalQuery: string;
}

export default function CausalTraceSection({ trace, originalQuery }: CausalTraceSectionProps) {
  /* Highlight influential tokens inside the original query */
  const renderHighlightedQuery = () => {
    if (!trace.influential_input_tokens.length) {
      return <span>{originalQuery}</span>;
    }

    const lowerTokens = trace.influential_input_tokens.map((t) => t.toLowerCase());
    const words = originalQuery.split(/(\s+)/);

    return words.map((word, i) => {
      const cleaned = word.toLowerCase().replace(/[.,!?;:"'()[\]{}]/g, "");
      const isInfluential = lowerTokens.includes(cleaned) && cleaned.length > 0;

      if (isInfluential) {
        return (
          <span
            key={i}
            style={{
              background: "rgba(34, 211, 238, 0.15)",
              color: "var(--accent-cyan)",
              padding: "2px 6px",
              borderRadius: "6px",
              border: "1px solid rgba(34, 211, 238, 0.3)",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            {word}
          </span>
        );
      }
      return <span key={i}>{word}</span>;
    });
  };

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
          <span style={{ fontSize: "18px" }}>🔍</span>
          <span style={{ fontWeight: 600, fontSize: "14px" }}>Causal Trace</span>
        </div>
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Highlighted Query */}
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Input Tokens Analysis
          </p>
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "var(--bg-input)",
              fontSize: "15px",
              lineHeight: "2",
              fontFamily: "'JetBrains Mono', monospace",
              wordBreak: "break-word",
            }}
          >
            {renderHighlightedQuery()}
          </div>
        </div>

        {/* Influential tokens list */}
        {trace.influential_input_tokens.length > 0 && (
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              Most Influential Tokens
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {trace.influential_input_tokens.map((token, i) => (
                <span
                  key={i}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    background: "rgba(34, 211, 238, 0.1)",
                    border: "1px solid rgba(34, 211, 238, 0.25)",
                    color: "var(--accent-cyan)",
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {token}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        {trace.explanation && (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "rgba(34, 211, 238, 0.05)",
              borderLeft: "3px solid var(--accent-cyan)",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: "1.6",
                fontStyle: "italic",
              }}
            >
              {trace.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
