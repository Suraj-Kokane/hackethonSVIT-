import { useState, useRef, useEffect } from "react";
import { FiSend, FiPaperclip, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

interface ChatInputProps {
  onSend: (query: string, file?: File) => void;
  loading: boolean;
  explainability: boolean;
}

export default function ChatInput({ onSend, loading, explainability }: ChatInputProps) {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [query]);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if ((!trimmed && !file) || loading) return;
    onSend(trimmed, file || undefined);
    setQuery("");
    setFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        padding: "16px 24px 24px",
        background: "linear-gradient(to top, var(--bg-primary) 60%, transparent)",
      }}
    >
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* File Preview */}
        {file && (
          <div
            className="animate-fade-in-up"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              marginBottom: "8px",
              width: "fit-content",
            }}
          >
            <div style={{ fontSize: "13px", color: "var(--text-primary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              📄 {file.name}
            </div>
            <button
              onClick={removeFile}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiX size={14} />
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            padding: "12px 16px",
            boxShadow: "var(--shadow-card)",
            transition: "border-color 0.2s",
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              border: "none",
              background: "var(--bg-input)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
              flexShrink: 0,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "var(--bg-card-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "var(--bg-input)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiPaperclip size={18} />
          </button>

          <textarea
            id="chat-input"
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything or upload a file…"
            rows={1}
            disabled={loading}
            style={{
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--text-primary)",
              fontSize: "15px",
              fontFamily: "inherit",
              lineHeight: "1.5",
              maxHeight: "160px",
            }}
          />

          <button
            id="send-button"
            onClick={handleSubmit}
            disabled={(!query.trim() && !file) || loading}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              border: "none",
              background:
                (query.trim() || file) && !loading
                  ? "var(--gradient-primary)"
                  : "var(--bg-input)",
              color:
                (query.trim() || file) && !loading
                  ? "#fff"
                  : "var(--text-muted)",
              cursor: (query.trim() || file) && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
              flexShrink: 0,
            }}
          >
            {loading ? (
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                }}
                className="animate-spin"
              />
            ) : (
              <FiSend size={18} />
            )}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            marginTop: "8px",
            fontSize: "11px",
            color: "var(--text-muted)",
          }}
        >
          <HiSparkles size={12} />
          <span>
            Explainability is{" "}
            <strong style={{ color: explainability ? "var(--accent-indigo)" : "var(--text-secondary)" }}>
              {explainability ? "enabled" : "disabled"}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
