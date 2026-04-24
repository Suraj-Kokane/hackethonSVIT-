import { useState } from "react";
import { FaBrain, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(10,14,26,0) 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
        className="animate-pulse-glow"
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(10,14,26,0) 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
        className="animate-pulse-glow"
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "440px",
          padding: "40px 32px",
          background: "rgba(26, 31, 53, 0.6)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "28px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        className="animate-fade-in-up"
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 20px",
              background: "var(--gradient-primary)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-glow)",
              transform: "rotate(-5deg)",
            }}
          >
            <FaBrain size={32} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 800,
              background: "var(--gradient-glow)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
              letterSpacing: "-0.5px",
            }}
          >
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.5" }}>
            {isRegister 
              ? "Join the future of transparent AI interaction." 
              : "Sign in to access your explainable AI workspace."}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {isRegister && (
            <div className="animate-fade-in">
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", marginLeft: "4px" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <FaUser style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 42px",
                    borderRadius: "14px",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", marginLeft: "4px" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <FaEnvelope style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 42px",
                  borderRadius: "14px",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", marginLeft: "4px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <FaLock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 42px",
                  borderRadius: "14px",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              marginTop: "10px",
              background: loading ? "var(--bg-card-hover)" : "var(--gradient-primary)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: loading ? "none" : "var(--shadow-glow)",
            }}
          >
            {loading ? (
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                }}
                className="animate-spin"
              />
            ) : (
              isRegister ? "Create Account" : "Sign In"
            )}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-indigo)",
                fontWeight: 700,
                cursor: "pointer",
                padding: "0 4px",
                fontSize: "14px",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {isRegister ? "Sign In" : "Register Now"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
