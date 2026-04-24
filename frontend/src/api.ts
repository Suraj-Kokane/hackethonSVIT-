/* ── API Service — communicates with the FastAPI backend ── */

import type { QueryResponse, ConversationEntry } from "./types";

// In dev: empty string (Vite proxy forwards /api → localhost:8000)
// In prod: set VITE_API_URL to your deployed backend URL
const BASE_URL = import.meta.env.VITE_API_URL ?? "https://xllm-svit.vercel.app";

export async function sendQuery(
  query: string,
  explainability: boolean = true,
  file?: File
): Promise<QueryResponse> {
  // Backend uses Form() parameters, so always send FormData
  const formData = new FormData();
  formData.append("query", query);
  formData.append("explainability", String(explainability));
  if (file) {
    formData.append("file", file);
  }

  const res = await fetch(`${BASE_URL}/api/query`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const detail = err.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ")
          : "Request failed";
    throw new Error(message);
  }

  return res.json();
}

export async function fetchLogs(): Promise<ConversationEntry[]> {
  const res = await fetch(`${BASE_URL}/api/logs`);
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export async function clearLogs(): Promise<void> {
  await fetch(`${BASE_URL}/api/logs`, { method: "DELETE" });
}

export async function healthCheck(): Promise<{ status: string; api_key_set: boolean }> {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error("Backend unreachable");
  return res.json();
}

export async function fetchTTS(
  text: string,
  lang: string = "en"
): Promise<{ audio_base64: string; format: string }> {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("lang", lang);

  const res = await fetch(`${BASE_URL}/api/tts`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof err.detail === "string" ? err.detail : "TTS request failed");
  }

  return res.json();
}
