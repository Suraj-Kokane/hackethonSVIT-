"""
FastAPI application — main entry point for the X-LLM backend.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import QueryRequest, QueryResponse, ConversationEntry
from app.llm_service import generate_response
from app.config import API_KEY, MAX_CONVERSATION_LOG_SIZE

# ── App setup ────────────────────────────────────────────
app = FastAPI(
    title="X-LLM — Explainable Generative AI",
    description="Generates answers AND transparent reasoning in real-time.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory conversation store ─────────────────────────
conversation_logs: List[ConversationEntry] = []


# ── Health check ─────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "api_key_set": bool(API_KEY),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from typing import Optional

# ── Main query endpoint ─────────────────────────────────
@app.post("/api/query", response_model=QueryResponse)
async def query_llm(
    query: str = Form(...),
    explainability: str = Form("true"),
    file: Optional[UploadFile] = File(None),
    conversation_id: Optional[str] = Form(None)
):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API_KEY not configured. Set it in your .env file.")

    is_explainability = explainability.lower() == "true"
    
    file_content = None
    if file:
        file_content = await file.read()
        # You might want to handle different file types here
        # For now, we'll just pass the raw bytes or decode if it's text

    try:
        result = generate_response(
            query=query, 
            explainability=is_explainability, 
            file_content=file_content,
            file_name=file.filename if file else None
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM generation failed: {exc}")

    # Assign conversation ID and persist
    conv_id = conversation_id or str(uuid.uuid4())
    result.conversation_id = conv_id

    entry = ConversationEntry(
        id=conv_id,
        query=query if not file else f"{query} (File: {file.filename})",
        response=result,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    conversation_logs.append(entry)

    # Cap the log size
    while len(conversation_logs) > MAX_CONVERSATION_LOG_SIZE:
        conversation_logs.pop(0)

    return result


# ── Conversation logs endpoint ───────────────────────────
@app.get("/api/logs", response_model=List[ConversationEntry])
async def get_logs():
    return list(reversed(conversation_logs))


@app.delete("/api/logs")
async def clear_logs():
    conversation_logs.clear()
    return {"status": "cleared"}


# ── Text-to-Speech endpoint ─────────────────────────────
@app.post("/api/tts")
async def text_to_speech(text: str = Form(...), lang: str = Form("en")):
    """Convert text to speech and return base64-encoded MP3 audio."""
    from app.tts_service import text_to_speech_base64

    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # Truncate very long texts to avoid TTS timeouts (max ~2000 chars)
    truncated = text[:2000]
    audio_b64 = text_to_speech_base64(truncated, lang=lang)

    if not audio_b64:
        raise HTTPException(status_code=502, detail="TTS generation failed.")

    return {"audio_base64": audio_b64, "format": "mp3"}
