@echo off
echo Starting SmartDocAI FastAPI Backend...
cd /d "%~dp0backend"
uvicorn backend:app --host 0.0.0.0 --port 8000 --reload
pause
