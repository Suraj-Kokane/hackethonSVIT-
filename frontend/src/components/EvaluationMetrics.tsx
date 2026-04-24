/* ── Evaluation Metrics Component ──────────────────────── */
import type { EvalMetrics } from "../types";

interface EvaluationMetricsProps {
  metrics: EvalMetrics;
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round(value * 100);
  return (
    <div style={{ flex: 1, minWidth: "140px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span style={{ fontSize: "12px", fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div
        style={{
          height: "8px",
          borderRadius: "4px",
          background: "var(--bg-input)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "4px",
            background: color,
            transition: "width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
      </div>
    </div>
  );
}

export default function EvaluationMetrics({ metrics }: EvaluationMetricsProps) {
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
          background: "rgba(52, 211, 153, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>📊</span>
          <span style={{ fontWeight: 600, fontSize: "14px" }}>Evaluation Metrics</span>
        </div>
      </div>

      {/* Bars */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <MetricBar label="Faithfulness" value={metrics.faithfulness} color="var(--accent-emerald)" />
        <MetricBar label="Interpretability" value={metrics.interpretability} color="var(--accent-violet)" />
        <MetricBar label="Completeness" value={metrics.completeness} color="var(--accent-cyan)" />
        <MetricBar label="Transparency" value={metrics.transparency} color="var(--accent-amber)" />
      </div>

      {/* Legend */}
      <div
        style={{
          padding: "0 20px 16px",
          fontSize: "11px",
          color: "var(--text-muted)",
          lineHeight: "1.6",
        }}
      >
        <strong>Faithfulness</strong> — reasoning matches the answer &nbsp;|&nbsp;
        <strong>Interpretability</strong> — human-understandable steps &nbsp;|&nbsp;
        <strong>Completeness</strong> — full query coverage &nbsp;|&nbsp;
        <strong>Transparency</strong> — data & logic disclosure
      </div>
    </div>
  );
}
