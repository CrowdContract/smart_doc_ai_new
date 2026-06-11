# SmartDocAI v2.0 — Glassmorphism + Skeuomorphism Edition

A full-stack AI document intelligence platform with a modern MERN-style React frontend
and an enhanced FastAPI backend.

---

## Architecture

```
SmartDocAI/
├── client/            ← React + Vite + Tailwind (the new MERN-style UI)
├── backend/           ← FastAPI (Python) — resume upload, analytics, feedback
├── pages/             ← Streamlit pages (Python AI: OCR, Whisper, gTTS)
├── start_backend.bat  ← Launch FastAPI on :8000
├── start_frontend.bat ← Launch React on :3000
└── start_streamlit.bat← Launch Streamlit on :8501
```

---

## Quick Start

### 1 — FastAPI Backend (port 8000)

```bash
cd backend
pip install -r requirements.txt
uvicorn backend:app --host 0.0.0.0 --port 8000 --reload
```

Or double-click **`start_backend.bat`**

API docs: http://localhost:8000/docs

---

### 2 — React Frontend (port 3000)

```bash
cd client
npm install
npm run dev
```

Or double-click **`start_frontend.bat`**

Open: http://localhost:3000

---

### 3 — Streamlit AI Backend (port 8501) — optional

Required for OCR, Whisper transcription, and gTTS voice synthesis.

```bash
pip install -r requirements.txt
streamlit run pages/1_Home.py
```

Or double-click **`start_streamlit.bat`**

---

## Features

| Feature          | React UI | FastAPI | Python/Streamlit |
|------------------|----------|---------|-----------------|
| Resume Upload    | ✅       | ✅      | —               |
| AI Summary       | ✅       | ✅      | —               |
| Analytics Dashboard | ✅    | ✅      | —               |
| Image → Text (OCR) | UI only | logs  | ✅ EasyOCR      |
| Voice → Text     | UI only  | logs   | ✅ Whisper      |
| Text → Voice     | UI only  | logs   | ✅ gTTS         |

---

## Design System

- **Glassmorphism** — frosted glass cards with `backdrop-filter: blur`
- **Skeuomorphism** — inset/raised shadows on inputs & buttons
- **Gold accent** — `#ffd700` primary colour throughout
- **Framer Motion** — page transitions and micro-animations
- **Recharts** — analytics charts

---

## Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Recharts, Axios, react-dropzone
- **Backend**: FastAPI, Uvicorn, PyPDF2, SQLite
- **AI (Python)**: EasyOCR, OpenAI Whisper, gTTS, Streamlit
