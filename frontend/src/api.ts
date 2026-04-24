/* ── API Service — communicates with the FastAPI backend ── */

import type { QueryResponse, ConversationEntry } from "./types";

const BASE_URL = "";  // proxied by Vite dev server

export async function sendQuery(
  query: string,
  explainability: boolean = true,
  file?: File
): Promise<QueryResponse> {
  let body: any;
  let headers: any = {};

  if (file) {
    const formData = new FormData();
    formData.append("query", query);
    formData.append("explainability", String(explainability));
    formData.append("file", file);
    body = formData;
    // Don't set Content-Type header, fetch will set it with boundary
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify({ query, explainability });
  }

  const res = await fetch(`${BASE_URL}/api/query`, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
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
