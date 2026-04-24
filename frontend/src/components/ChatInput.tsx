import { useState, useRef, useEffect } from "react";
import { FiSend, FiPaperclip, FiX, FiMic, FiMicOff } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

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

  const voice = useVoiceRecorder();

  // Sync voice transcript into the input
  useEffect(() => {
    if (voice.transcript || voice.interimTranscript) {
      const combined = (voice.transcript + " " + voice.interimTranscript).trim();
      setQuery(combined);
    }
  }, [voice.transcript, voice.interimTranscript]);

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
    // Stop listening if mic is on
    if (voice.isListening) voice.stopListening();
    voice.clearTranscript();
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

  const handleMicToggle = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.clearTranscript();
      setQuery("");
      voice.startListening();
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
        {/* Voice Error Toast */}
        {voice.error && (
          <div
            className="animate-fade-in-up"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              borderRadius: "10px",
              marginBottom: "8px",
              fontSize: "12px",
              color: "var(--accent-rose)",
            }}
          >
            <FiMicOff size={14} />
            {voice.error}
            <button
              onClick={() => voice.clearTranscript()}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "var(--accent-rose)",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <FiX size={14} />
            </button>
          </div>
        )}

        {/* Listening Indicator */}
        {voice.isListening && (
          <div
            className="animate-fade-in-up"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              background: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              borderRadius: "12px",
              marginBottom: "8px",
            }}
          >
            <div className="voice-pulse-ring" />
            <span style={{ fontSize: "13px", color: "var(--accent-indigo)", fontWeight: 600 }}>
              Listening…
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
              {voice.interimTranscript || "Speak now"}
            </span>
          </div>
        )}

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
            border: voice.isListening
              ? "1px solid var(--accent-indigo)"
              : "1px solid var(--border-color)",
            borderRadius: "16px",
            padding: "12px 16px",
            boxShadow: voice.isListening
              ? "0 0 20px rgba(99, 102, 241, 0.15)"
              : "var(--shadow-card)",
            transition: "border-color 0.2s, box-shadow 0.3s",
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
            placeholder={voice.isListening ? "Listening… speak now" : "Ask anything or upload a file…"}
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

          {/* Microphone Button */}
          {voice.isSupported && (
            <button
              id="mic-button"
              onClick={handleMicToggle}
              disabled={loading}
              title={voice.isListening ? "Stop listening" : "Start voice input"}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                border: "none",
                background: voice.isListening
                  ? "var(--accent-rose)"
                  : "var(--bg-input)",
                color: voice.isListening ? "#fff" : "var(--text-secondary)",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                if (!voice.isListening) {
                  e.currentTarget.style.background = "var(--bg-card-hover)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseOut={(e) => {
                if (!voice.isListening) {
                  e.currentTarget.style.background = "var(--bg-input)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              {voice.isListening && (
                <span
                  className="mic-pulse"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "12px",
                    border: "2px solid var(--accent-rose)",
                  }}
                />
              )}
              {voice.isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
            </button>
          )}

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
