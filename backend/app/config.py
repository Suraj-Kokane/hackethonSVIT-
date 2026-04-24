"""
Application configuration — loads environment variables securely.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend directory (works locally + in serverless)
_backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(_backend_dir / ".env")

API_KEY: str = os.getenv("API_KEY", "")
MODEL_NAME: str = os.getenv("MODEL_NAME", "llama-3.3-70b-versatile")
MAX_CONVERSATION_LOG_SIZE: int = 200  # max saved conversations
