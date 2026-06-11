"""
SmartDocAI - Enhanced FastAPI Backend
Glassmorphism + Skeuomorphism MERN-compatible API
"""

import os, io, re, json, datetime
from collections import Counter
from typing import Optional, List

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sqlite3

# ============================================================
#  App Setup
# ============================================================
app = FastAPI(
    title="SmartDocAI API",
    description="AI-powered document understanding API",
    version="2.0.0",
)

# Allow all origins in dev; restrict to your Vercel URL in prod
ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "*"                         # override via env var on Render
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
#  Database — use /tmp on Render (ephemeral), or local path
# ============================================================
DB_PATH = os.environ.get("DB_PATH", os.path.join(os.path.dirname(__file__), "smartdocai.db"))

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        content TEXT,
        summary TEXT,
        top_words TEXT,
        used_fallback INTEGER DEFAULT 1,
        uploaded_at TEXT DEFAULT (datetime('now'))
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        detail TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feature TEXT,
        rating INTEGER,
        comment TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    )
    """)

    conn.commit()
    conn.close()

init_db()

# ============================================================
#  Helpers
# ============================================================
STOPWORDS = {
    "the","and","for","are","was","were","with","that","this","have","from",
    "not","but","they","you","all","can","has","been","had","will","would",
    "could","should","may","might","shall","its","our","your","their","which",
    "who","when","where","how","why","what","there","here","than","then","into",
    "more","also","just","over","such","some","any","each","both","most","other",
    "these","those","about","after","before","between","under","above","through",
    "during","without","within","along","across","behind","beyond","plus","except",
    "up","out","at","by","to","in","on","is","it","as","be","do","if","an","a","of",
}

def extract_top_words(text: str, n: int = 10) -> List[str]:
    words = re.findall(r"[a-zA-Z]{3,}", text.lower())
    filtered = [w for w in words if w not in STOPWORDS]
    return [w for w, _ in Counter(filtered).most_common(n)]

def simple_summary(text: str, max_sentences: int = 5) -> str:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return " ".join(sentences[:max_sentences]) if sentences else text[:300]

def log_event(conn, event_type: str, detail: str = ""):
    conn.execute(
        "INSERT INTO analytics_events (event_type, detail) VALUES (?, ?)",
        (event_type, detail),
    )
    conn.commit()

# ============================================================
#  Schemas
# ============================================================
class FeedbackIn(BaseModel):
    feature: str
    rating: int
    comment: Optional[str] = ""

# ============================================================
#  Routes — Health
# ============================================================
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "SmartDocAI API v2.0"}

@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "version": "2.0.0",
    }

# ============================================================
#  Routes — Resume
# ============================================================
@app.post("/upload-resume", tags=["Resume"])
async def upload_resume(file: UploadFile = File(...)):
    """Upload a PDF resume → extract text → summarize → store."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    try:
        raw_bytes = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(raw_bytes))
        text = "\n".join(
            page.extract_text() or "" for page in pdf_reader.pages
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"PDF parse error: {e}")

    top_words = extract_top_words(text)
    summary = simple_summary(text)
    used_fallback = 1
    uploaded_at = datetime.datetime.utcnow().isoformat()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO resumes (filename, content, summary, top_words, used_fallback, uploaded_at)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (file.filename, text, summary, json.dumps(top_words), used_fallback, uploaded_at),
    )
    conn.commit()
    new_id = cursor.lastrowid

    cursor.execute(
        "INSERT INTO analytics_events (event_type, detail) VALUES (?, ?)",
        ("resume_upload", file.filename),
    )
    conn.commit()
    conn.close()

    return {
        "id": new_id,
        "filename": file.filename,
        "summary": summary,
        "top_words": top_words,
        "used_fallback": bool(used_fallback),
        "uploaded_at": uploaded_at,
    }


@app.get("/insights", tags=["Resume"])
def get_insights(limit: int = 50, id: Optional[int] = None):
    """Fetch uploaded resumes. Filter by ?id= for a single record."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    if id is not None:
        cursor.execute("SELECT * FROM resumes WHERE id = ?", (id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            raise HTTPException(status_code=404, detail="Resume not found.")
        r = dict(row)
        r["top_words"] = json.loads(r.get("top_words") or "[]")
        r["used_fallback"] = bool(r["used_fallback"])
        return r

    cursor.execute(
        "SELECT id, filename, summary, top_words, used_fallback, uploaded_at FROM resumes ORDER BY id DESC LIMIT ?",
        (limit,),
    )
    rows = cursor.fetchall()
    conn.close()
    result = []
    for row in rows:
        r = dict(row)
        r["top_words"] = json.loads(r.get("top_words") or "[]")
        r["used_fallback"] = bool(r["used_fallback"])
        result.append(r)
    return result


@app.delete("/resumes/{resume_id}", tags=["Resume"])
def delete_resume(resume_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM resumes WHERE id = ?", (resume_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return {"deleted": True, "id": resume_id}

# ============================================================
#  Routes — Analytics
# ============================================================
@app.get("/analytics/summary", tags=["Analytics"])
def analytics_summary():
    """Return dashboard-level stats."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM resumes")
    total_resumes = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM analytics_events")
    total_events = cursor.fetchone()[0]

    cursor.execute(
        "SELECT event_type, COUNT(*) as cnt FROM analytics_events GROUP BY event_type ORDER BY cnt DESC"
    )
    event_breakdown = {row[0]: row[1] for row in cursor.fetchall()}

    cursor.execute(
        "SELECT DATE(created_at) as day, COUNT(*) as cnt FROM analytics_events "
        "GROUP BY day ORDER BY day DESC LIMIT 7"
    )
    daily_activity = [{"date": row[0], "count": row[1]} for row in cursor.fetchall()]

    conn.close()
    return {
        "total_resumes": total_resumes,
        "total_events": total_events,
        "event_breakdown": event_breakdown,
        "daily_activity": daily_activity,
    }


@app.post("/analytics/event", tags=["Analytics"])
def record_event(event_type: str, detail: str = ""):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO analytics_events (event_type, detail) VALUES (?, ?)",
        (event_type, detail),
    )
    conn.commit()
    conn.close()
    return {"recorded": True}

# ============================================================
#  Routes — Feedback
# ============================================================
@app.post("/feedback", tags=["Feedback"])
def submit_feedback(fb: FeedbackIn):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO feedback (feature, rating, comment) VALUES (?, ?, ?)",
        (fb.feature, fb.rating, fb.comment),
    )
    conn.commit()
    conn.close()
    return {"submitted": True}


@app.get("/feedback", tags=["Feedback"])
def get_feedback():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM feedback ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]
