/* ── Reasoning Section Component ───────────────────────── */
import { FiChevronRight } from "react-icons/fi";

interface ReasoningSectionProps {
  reasoning: string[];
  keySteps: number[];
}

export default function ReasoningSection({ reasoning, keySteps }: ReasoningSectionProps) {
  if (!reasoning.length) return null;

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
          background: "rgba(139, 92, 246, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🧠</span>
          <span style={{ fontWeight: 600, fontSize: "14px" }}>Step-by-Step Reasoning</span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              color: "var(--text-muted)",
              padding: "2px 8px",
              background: "var(--bg-input)",
              borderRadius: "6px",
            }}
          >
            {reasoning.length} steps
          </span>
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {reasoning.map((step, i) => {
          const isKey = keySteps.includes(i);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: isKey
                  ? "rgba(139, 92, 246, 0.08)"
                  : "var(--bg-input)",
                border: isKey
                  ? "1px solid rgba(139, 92, 246, 0.25)"
                  : "1px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  minWidth: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: isKey ? "var(--accent-violet)" : "var(--border-color)",
                  color: isKey ? "#fff" : "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: isKey ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {step}
                </p>
                {isKey && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "6px",
                      fontSize: "11px",
                      color: "var(--accent-violet)",
                      fontWeight: 600,
                    }}
                  >
                    <FiChevronRight size={12} />
                    Key Decision Point
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
