/* ── Header Component ──────────────────────────────────── */
import { FaBrain, FaPalette } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useState, useEffect } from "react";

interface HeaderProps {
  explainability: boolean;
  onToggleExplainability: () => void;
}

export default function Header({ explainability, onToggleExplainability }: HeaderProps) {
  const [theme, setTheme] = useState<"default" | "theme4-light" | "theme4-dark">("default");

  useEffect(() => {
    document.body.className = theme === "default" ? "" : theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === "default") return "theme4-light";
      if (prev === "theme4-light") return "theme4-dark";
      return "default";
    });
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border-color)",
        background: "rgba(10, 14, 26, 0.85)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 18px rgba(99,102,241,0.35)",
            }}
          >
            <FaBrain size={22} color="#fff" />
          </div>
          <div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 700,
                background: "var(--gradient-glow)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
              X-LLM
            </h1>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
              Explainable Generative AI
            </p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Aqua Theme"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.25s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-indigo)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.background = "var(--bg-card-hover)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.background = "var(--bg-card)";
            }}
          >
            <FaPalette size={16} />
          </button>

          {/* Explainability Toggle */}
          <button
            id="toggle-explainability"
            onClick={onToggleExplainability}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "9999px",
              border: `1px solid ${explainability ? "var(--accent-indigo)" : "var(--border-color)"}`,
              background: explainability
                ? "rgba(99, 102, 241, 0.15)"
                : "var(--bg-card)",
              color: explainability ? "var(--accent-indigo)" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "inherit",
              transition: "all 0.25s ease",
            }}
          >
            <HiSparkles size={16} />
            XAI {explainability ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </header>
  );
}
