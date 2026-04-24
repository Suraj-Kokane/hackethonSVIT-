import { useState } from "react";
import { FiPlus, FiClock, FiFolderPlus, FiMenu } from "react-icons/fi";

interface SidebarProps {
  onNewChat: () => void;
  onHistory: () => void;
  onNewProject: () => void;
}

export default function Sidebar({ onNewChat, onHistory, onNewProject }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: isCollapsed ? "80px" : "260px",
        height: "100vh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        padding: isCollapsed ? "20px 12px" : "20px 16px",
        gap: "16px",
        flexShrink: 0,
        transition: "width 0.3s ease, padding 0.3s ease",
        overflowX: "hidden",
      }}
    >
      <div 
        style={{ 
          marginBottom: "8px", 
          padding: "0 8px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: isCollapsed ? "center" : "space-between" 
        }}
      >
        {!isCollapsed && (
          <h2 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap" }}>
            Workspace
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            borderRadius: "8px",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--bg-card)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <FiMenu size={20} />
        </button>
      </div>

      <button
        onClick={onNewProject}
        title="New Project"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "12px",
          padding: isCollapsed ? "12px" : "12px 16px",
          background: "var(--bg-card)",
          border: "1px dashed var(--border-color)",
          borderRadius: "12px",
          color: "var(--text-primary)",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-indigo)";
          e.currentTarget.style.background = "var(--bg-card-hover)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.background = "var(--bg-card)";
        }}
      >
        <FiFolderPlus size={18} color="var(--accent-indigo)" style={{ flexShrink: 0 }} />
        {!isCollapsed && <span style={{ whiteSpace: "nowrap" }}>New Project</span>}
      </button>

      <button
        onClick={onNewChat}
        title="New Chat"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "12px",
          padding: isCollapsed ? "12px" : "12px 16px",
          background: "var(--gradient-primary)",
          border: "none",
          borderRadius: "12px",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        <FiPlus size={18} style={{ flexShrink: 0 }} />
        {!isCollapsed && <span style={{ whiteSpace: "nowrap" }}>New Chat</span>}
      </button>

      <div style={{ margin: "16px 0", height: "1px", background: "var(--border-color)" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={onHistory}
          title="History"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: "12px",
            padding: isCollapsed ? "12px" : "12px 16px",
            background: "transparent",
            border: "none",
            borderRadius: "12px",
            color: "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--bg-card)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <FiClock size={18} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span style={{ whiteSpace: "nowrap" }}>History</span>}
        </button>
      </div>
    </aside>
  );
}
