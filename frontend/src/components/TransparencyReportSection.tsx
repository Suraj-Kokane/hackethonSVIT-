/* ── Transparency Report Component ──────────────────────── */
import type { TransparencyReport } from "../types";
import { FiShield, FiDatabase, FiAlertTriangle } from "react-icons/fi";

interface TransparencyReportSectionProps {
  report: TransparencyReport;
}

export default function TransparencyReportSection({ report }: TransparencyReportSectionProps) {
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
          background: "rgba(245, 158, 11, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🛡️</span>
          <span style={{ fontWeight: 600, fontSize: "14px" }}>Transparency Report (Thesis 2)</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Logical Basis */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--accent-amber)" }}>
            <FiShield size={14} />
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Logical Basis
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
            {report.logical_basis}
          </p>
        </div>

        {/* Data Provenance */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--accent-cyan)" }}>
            <FiDatabase size={14} />
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Data Provenance
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
            {report.data_provenance}
          </p>
        </div>

        {/* Limitations */}
        {report.limitations.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--accent-rose)" }}>
              <FiAlertTriangle size={14} />
              <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Knowledge Limitations
              </span>
            </div>
            <ul style={{ paddingLeft: "18px", margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
              {report.limitations.map((limit, i) => (
                <li key={i} style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  {limit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
