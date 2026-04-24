/* ── Conversation Logs Sidebar ─────────────────────────── */
import { useEffect, useState } from "react";
import { FiClock, FiTrash2, FiX, FiRefreshCw } from "react-icons/fi";
import type { ConversationEntry } from "../types";
import { fetchLogs, clearLogs } from "../api";

interface ConversationLogsProps {
  open: boolean;
  onClose: () => void;
}

export default function ConversationLogs({ open, onClose }: ConversationLogsProps) {
  const [logs, setLogs] = useState<ConversationEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchLogs();
      setLogs(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleClear = async () => {
    await clearLogs();
    setLogs([]);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 60,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "420px",
          maxWidth: "90vw",
          height: "100vh",
          background: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border-color)",
          zIndex: 70,
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiClock size={18} color="var(--accent-indigo)" />
            <span style={{ fontWeight: 600, fontSize: "16px" }}>Conversation Logs</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={load}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "6px",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
              }}
              title="Refresh"
            >
              <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleClear}
              style={{
                background: "rgba(244, 63, 94, 0.1)",
                border: "1px solid rgba(244, 63, 94, 0.25)",
                borderRadius: "8px",
                padding: "6px",
                color: "var(--accent-rose)",
                cursor: "pointer",
                display: "flex",
              }}
              title="Clear all"
            >
              <FiTrash2 size={16} />
            </button>
            <button
              onClick={onClose}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "6px",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
              }}
              title="Close"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Logs */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
          {logs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                color: "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              {loading ? "Loading…" : "No conversations yet."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {logs.map((entry) => (
                <div
                  key={entry.id + entry.timestamp}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    transition: "border-color 0.2s",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {entry.query}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {entry.response.answer}
                  </p>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        background: "rgba(99, 102, 241, 0.1)",
                        color: "var(--accent-indigo)",
                        fontWeight: 600,
                      }}
                    >
                      {(entry.response.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
