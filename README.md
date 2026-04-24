# 🧠 X-LLM — Explainable Generative AI

A full-stack application that generates **answers AND transparent reasoning simultaneously**, making AI more transparent and trustworthy.

> **Key Principle:** Explanation is generated WITH the answer, not after — this is a dual output pipeline, not post-hoc rationalization.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧾 **Final Answer** | Clear, concise AI-generated response |
| 💡 **Interpretable Narrative** | A human-friendly story explaining the logic |
| 🧠 **Step-by-Step Reasoning** | Chain-of-thought breakdown |
| 🛡️ **Transparency Report** | Logical basis, data provenance, and knowledge limitations (Thesis 2) |
| 🔍 **Causal Trace** | Highlights which input tokens & reasoning steps influenced the output |
| 📊 **Evaluation Metrics** | Faithfulness, Interpretability, Completeness, and Transparency scores |
| ⚠️ **Bias Detection** | Automatic bias warnings |
| 🎯 **Confidence Score** | Model self-assessed confidence level |
| 🔄 **Explainability Toggle** | Switch XAI on/off |
| 💾 **Conversation Logs** | Persistent session history |

---

## 🏗️ Architecture

```
frontend/          React + Vite + Tailwind CSS v4
├── src/
│   ├── App.tsx                 Main chat application
│   ├── api.ts                  API service layer
│   ├── types.ts                TypeScript type definitions
│   └── components/
│       ├── Header.tsx           Header with XAI toggle
│       ├── ChatInput.tsx        Chat input with auto-resize
│       ├── AnswerSection.tsx    Answer display + confidence badge
│       ├── NarrativeExplanation.tsx Interpretable narrative display
│       ├── ReasoningSection.tsx Step-by-step reasoning display
│       ├── TransparencyReportSection.tsx Thesis 2 transparency report
│       ├── CausalTraceSection.tsx Token highlighting & causal explanation
│       ├── EvaluationMetrics.tsx Metric progress bars
│       ├── BiasWarnings.tsx     Bias alert display
│       └── ConversationLogs.tsx Slide-in log viewer

backend/           Python FastAPI
├── app/
│   ├── main.py       FastAPI routes (query, logs, health)
│   ├── config.py     Secure env variable loading
│   ├── prompts.py    Prompt engineering templates
│   ├── llm_service.py Google Gemini integration
│   ├── evaluation.py  Faithfulness/Interpretability/Completeness metrics
│   └── schemas.py    Pydantic request/response models
├── .env              API key configuration
└── requirements.txt  Python dependencies
```

---

## 🚀 Quick Start

### 1. Set your API key

Edit `backend/.env`:
```
API_KEY=your_google_gemini_api_key_here
```

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ⚙️ Tech Stack

- **Frontend:** React 19 · Vite · Tailwind CSS v4 · Framer Motion · React Icons
- **Backend:** Python · FastAPI · Pydantic · Uvicorn
- **LLM:** Google Gemini (gemini-2.0-flash)
- **API Security:** Environment variables via python-dotenv

---

## 📊 Evaluation Metrics

| Metric | What it measures |
|---|---|
| **Faithfulness** | Do reasoning steps reference content in the final answer? |
| **Interpretability** | Are the steps human-readable (length, clarity)? |
| **Completeness** | Does the reasoning cover key concepts from the query? |
| **Transparency** | Disclosure of logical basis, data provenance, and model limitations (Thesis 2) |

---

## 🎯 Design Goals

1. **Dual Output Pipeline** — Answer + reasoning generated in a single LLM call
2. **Causal Transparency** — Show exactly which tokens drove the output
3. **Real-time Evaluation** — Automatic quality scoring on every response
4. **Beautiful UX** — Premium dark-mode interface with animations
