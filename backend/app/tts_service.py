"""
Text-to-Speech service — converts response text to audio (base64 MP3).
Kept as a separate module for modularity.
"""
from __future__ import annotations

import base64
import io
import logging

logger = logging.getLogger(__name__)


def text_to_speech_base64(text: str, lang: str = "en") -> str:
    """
    Convert text to speech and return a base64-encoded MP3 string.
    Uses gTTS (Google Text-to-Speech) — free and requires no API key.
    Returns empty string on failure so the caller can still serve text.
    """
    try:
        from gtts import gTTS

        tts = gTTS(text=text, lang=lang, slow=False)
        buf = io.BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)
        audio_b64 = base64.b64encode(buf.read()).decode("utf-8")
        return audio_b64
    except Exception as exc:
        logger.error(f"TTS generation failed: {exc}")
        return ""
