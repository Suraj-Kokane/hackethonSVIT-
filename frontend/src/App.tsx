/* ── Main App Component ────────────────────────────────── */
import { useState, useRef, useEffect } from "react";
import { FiClock, FiUser } from "react-icons/fi";
import { FaBrain } from "react-icons/fa";

import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import AnswerSection from "./components/AnswerSection";
import ReasoningSection from "./components/ReasoningSection";
import CausalTraceSection from "./components/CausalTraceSection";
import EvaluationMetrics from "./components/EvaluationMetrics";
import BiasWarnings from "./components/BiasWarnings";
import TransparencyReportSection from "./components/TransparencyReportSection";
import NarrativeExplanation from "./components/NarrativeExplanation";
import ConversationLogs from "./components/ConversationLogs";
import ImageResult from "./components/ImageResult";
import AudioPlayback from "./components/AudioPlayback";
import { sendQuery } from "./api";
import type { ChatMessage } from "./types";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [explainability, setExplainability] = useState(true);
  const [logsOpen, setLogsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewProject = () => {
    setMessages([]);
    alert("New project environment initialized.");
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSend = async (query: string, file?: File) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: file ? `${query} (Uploaded: ${file.name})`.trim() : query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await sendQuery(query, explainability, file);

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        response: result,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `⚠️ Error: ${err.message || "Something went wrong. Is the backend running?"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar 
        onNewChat={handleNewChat}
        onHistory={() => setLogsOpen(true)}
        onNewProject={handleNewProject}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", position: "relative" }}>
      <Header
        explainability={explainability}
        onToggleExplainability={() => setExplainability((v) => !v)}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
        {/* Chat messages */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: "16px", minHeight: 0 }}>
          {messages.length === 0 ? (
            /* Empty state */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: "60vh",
                padding: "40px 20px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "24px",
                  background: "var(--gradient-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                  boxShadow: "0 0 40px rgba(99, 102, 241, 0.3)",
                }}
              >
                <FaBrain size={36} color="#fff" />
              </div>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  background: "var(--gradient-glow)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "12px",
                }}
              >
                Welcome to X-LLM
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  textAlign: "center",
                  maxWidth: "480px",
                  lineHeight: "1.6",
                  marginBottom: "32px",
                }}
              >
                Ask any question and get a transparent, explainable answer with
                step-by-step reasoning, causal tracing, transparency reports, and confidence scoring.
              </p>

              {/* Suggestion chips */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "center",
                  maxWidth: "600px",
                }}
              >
                {[
                  "How does photosynthesis work?",
                  "Explain quantum entanglement",
                  "Why is the sky blue?",
                  "What causes inflation?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "12px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
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
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message list */
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    /* User message */
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "75%",
                          padding: "14px 18px",
                          borderRadius: "16px 16px 4px 16px",
                          background: "var(--gradient-primary)",
                          color: "#fff",
                          fontSize: "15px",
                          lineHeight: "1.6",
                          boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
                        }}
                      >
                        {msg.content}
                      </div>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-color)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FiUser size={16} color="var(--text-secondary)" />
                      </div>
                    </div>
                  ) : (
                    /* Assistant message */
                    <div style={{ display: "flex", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "var(--gradient-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FaBrain size={16} color="#fff" />
                      </div>

                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                          minWidth: 0,
                        }}
                      >
                        {msg.response ? (
                          <>
                            {/* Answer */}
                            <AnswerSection
                              answer={msg.response.answer}
                              confidence={msg.response.confidence}
                            />

                            {/* Audio Playback */}
                            <AudioPlayback text={msg.response.answer} />

                            {/* Generated Image */}
                            {msg.response.image_url && (
                              <ImageResult imageUrl={msg.response.image_url} />
                            )}

                            {/* Narrative Explanation */}
                            {msg.response.explanation && (
                              <NarrativeExplanation explanation={msg.response.explanation} />
                            )}

                            {/* Bias Warnings */}
                            {msg.response.bias_warnings.length > 0 && (
                              <BiasWarnings warnings={msg.response.bias_warnings} />
                            )}

                            {/* Reasoning */}
                            {msg.response.reasoning.length > 0 && (
                              <ReasoningSection
                                reasoning={msg.response.reasoning}
                                keySteps={
                                  msg.response.causal_trace?.key_reasoning_steps || []
                                }
                              />
                            )}

                            {/* Causal Trace */}
                            {msg.response.causal_trace && (
                              <CausalTraceSection
                                trace={msg.response.causal_trace}
                                originalQuery={
                                  messages[messages.indexOf(msg) - 1]?.content || ""
                                }
                              />
                            )}

                            {/* Transparency Report */}
                            {msg.response.transparency_report && (
                              <TransparencyReportSection report={msg.response.transparency_report} />
                            )}

                            {/* Evaluation */}
                            {msg.response.evaluation && (
                              <EvaluationMetrics metrics={msg.response.evaluation} />
                            )}
                          </>
                        ) : (
                          /* Error / plain text */
                          <div
                            style={{
                              padding: "14px 18px",
                              borderRadius: "16px 16px 16px 4px",
                              background: "var(--bg-card)",
                              border: "1px solid var(--border-color)",
                              fontSize: "15px",
                              lineHeight: "1.6",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {msg.content}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "var(--gradient-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FaBrain size={16} color="#fff" />
                  </div>
                  <div
                    style={{
                      padding: "16px 20px",
                      borderRadius: "16px 16px 16px 4px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid var(--border-color)",
                        borderTopColor: "var(--accent-indigo)",
                        borderRadius: "50%",
                      }}
                      className="animate-spin"
                    />
                    <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                      {explainability
                        ? "Generating answer with reasoning & causal trace…"
                        : "Generating answer…"}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          loading={loading}
          explainability={explainability}
        />
      </div>

      {/* Logs button (floating) */}
      <button
        id="open-logs"
        onClick={() => setLogsOpen(true)}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "24px",
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          border: "1px solid var(--border-color)",
          background: "var(--bg-card)",
          color: "var(--text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-card)",
          transition: "all 0.25s",
          zIndex: 40,
        }}
        title="View conversation logs"
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-indigo)";
          e.currentTarget.style.color = "var(--accent-indigo)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
      >
        <FiClock size={20} />
      </button>

      {/* Conversation logs sidebar */}
      <ConversationLogs open={logsOpen} onClose={() => setLogsOpen(false)} />
      </div>
    </div>
  );
}
