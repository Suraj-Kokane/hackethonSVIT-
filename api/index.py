"""
Vercel serverless entry point — wraps the FastAPI app
so that Vercel can serve it as a serverless function.
"""
import sys
import os

# Make sure the backend package is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app  # noqa: E402  — the FastAPI instance
