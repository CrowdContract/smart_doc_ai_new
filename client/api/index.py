"""
SmartDocAI FastAPI — Vercel Serverless Entry Point
All routes live here. SQLite uses /tmp (ephemeral on Vercel).
"""

import os, io, re, json, datetime, sqlite3
from collections import Counter
from typing import Optional, List

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import PyPDF2

# ── App ───────────────────────────────────────────────────
app = FastAPI(title="SmartDocAI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── DB — /tmp is writable on Vercel serverless ───────────
DB_PATH = "/tmp/smartdocai.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        content TEXT, summary TEXT, top_words TEXT,
        used_fallback INTEGER DEFAULT 1,
        uploaded_at TEXT DEFAULT (datetime('now')))""")
    c.execute("""CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL, detail TEXT,
        created_at TEXT DEFAULT (datetime('now')))""")
    c.execute("""CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feature TEXT, rating INTEGER, comment TEXT,
        created_at TEXT DEFAULT (datetime('now')))""")
    conn.commit()
    conn.close()

init_db()

# ── Helpers ──────────────────────────────────────────────
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

def top_words(text: str, n=10):
    words = re.findall(r"[a-zA-Z]{3,}", text.lower())
    filtered = [w for w in words if w not in STOPWORDS]
    return [w for w, _ in Counter(filtered).most_common(n)]

def summary(text: str, n=5):
    s = re.split(r"(?<=[.!?])\s+", text.strip())
    return " ".join(s[:n]) if s else text[:300]

class FeedbackIn(BaseModel):
    feature: str
    rating: int
    comment: Optional[str] = ""

# ── Health ────────────────────────────────────────────────
@app.get("/api")
@app.get("/api/")
def root():
    return {"status": "ok", "service": "SmartDocAI API v2.0"}

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "version": "2.0.0",
    }

# ── Resume ────────────────────────────────────────────────
@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted.")
    try:
        raw = await file.read()
        reader = PyPDF2.PdfReader(io.BytesIO(raw))
        text = "\n".join(p.extract_text() or "" for p in reader.pages)
    except Exception as e:
        raise HTTPException(422, f"PDF parse error: {e}")

    tw = top_words(text)
    sm = summary(text)
    now = datetime.datetime.utcnow().isoformat()
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO resumes (filename,content,summary,top_words,used_fallback,uploaded_at) VALUES(?,?,?,?,?,?)",
        (file.filename, text, sm, json.dumps(tw), 1, now))
    conn.commit()
    new_id = cur.lastrowid
    cur.execute("INSERT INTO analytics_events (event_type,detail) VALUES(?,?)", ("resume_upload", file.filename))
    conn.commit()
    conn.close()
    return {"id": new_id, "filename": file.filename, "summary": sm, "top_words": tw, "used_fallback": True, "uploaded_at": now}

@app.get("/api/insights")
def get_insights(limit: int = 50, id: Optional[int] = None):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    if id is not None:
        cur.execute("SELECT * FROM resumes WHERE id=?", (id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            raise HTTPException(404, "Not found.")
        r = dict(row)
        r["top_words"] = json.loads(r.get("top_words") or "[]")
        r["used_fallback"] = bool(r["used_fallback"])
        return r
    cur.execute("SELECT id,filename,summary,top_words,used_fallback,uploaded_at FROM resumes ORDER BY id DESC LIMIT ?", (limit,))
    rows = cur.fetchall()
    conn.close()
    result = []
    for row in rows:
        r = dict(row)
        r["top_words"] = json.loads(r.get("top_words") or "[]")
        r["used_fallback"] = bool(r["used_fallback"])
        result.append(r)
    return result

@app.delete("/api/resumes/{resume_id}")
def delete_resume(resume_id: int):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("DELETE FROM resumes WHERE id=?", (resume_id,))
    conn.commit()
    deleted = cur.rowcount
    conn.close()
    if deleted == 0:
        raise HTTPException(404, "Not found.")
    return {"deleted": True, "id": resume_id}

# ── Analytics ─────────────────────────────────────────────
@app.get("/api/analytics/summary")
def analytics_summary():
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM resumes")
    total_resumes = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM analytics_events")
    total_events = cur.fetchone()[0]
    cur.execute("SELECT event_type, COUNT(*) as cnt FROM analytics_events GROUP BY event_type ORDER BY cnt DESC")
    event_breakdown = {r[0]: r[1] for r in cur.fetchall()}
    cur.execute("SELECT DATE(created_at) as day, COUNT(*) as cnt FROM analytics_events GROUP BY day ORDER BY day DESC LIMIT 7")
    daily_activity = [{"date": r[0], "count": r[1]} for r in cur.fetchall()]
    conn.close()
    return {"total_resumes": total_resumes, "total_events": total_events, "event_breakdown": event_breakdown, "daily_activity": daily_activity}

@app.post("/api/analytics/event")
def record_event(event_type: str, detail: str = ""):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.execute("INSERT INTO analytics_events (event_type,detail) VALUES(?,?)", (event_type, detail))
    conn.commit()
    conn.close()
    return {"recorded": True}

# ── Feedback ──────────────────────────────────────────────
@app.post("/api/feedback")
def submit_feedback(fb: FeedbackIn):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.execute("INSERT INTO feedback (feature,rating,comment) VALUES(?,?,?)", (fb.feature, fb.rating, fb.comment))
    conn.commit()
    conn.close()
    return {"submitted": True}

@app.get("/api/feedback")
def get_feedback():
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM feedback ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]
