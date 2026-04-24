/* ── API Service — communicates with the FastAPI backend ── */

import type { QueryResponse, ConversationEntry } from "./types";

const BASE_URL = "";  // proxied by Vite dev server

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
