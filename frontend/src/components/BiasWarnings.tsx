/* ── Bias Warnings Component ───────────────────────────── */
import { FiAlertTriangle } from "react-icons/fi";

interface BiasWarningsProps {
  warnings: string[];
}

export default function BiasWarnings({ warnings }: BiasWarningsProps) {
  if (!warnings.length) return null;

  return (
    <div
      style={{
        background: "rgba(244, 63, 94, 0.06)",
        border: "1px solid rgba(244, 63, 94, 0.2)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
      className="animate-fade-in-up"
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid rgba(244, 63, 94, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <FiAlertTriangle size={18} color="var(--accent-rose)" />
        <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--accent-rose)" }}>
          Bias Detection Warnings
        </span>
      </div>

      {/* Warning list */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {warnings.map((w, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(244, 63, 94, 0.06)",
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: "1.5",
            }}
          >
            <span style={{ color: "var(--accent-rose)", fontWeight: 700, flexShrink: 0 }}>⚠</span>
            {w}
          </div>
        ))}
      </div>
    </div>
  );
}
