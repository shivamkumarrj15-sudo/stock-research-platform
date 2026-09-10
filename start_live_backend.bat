@echo off
title AI Stock Research Platform - Real-Time Live Backend
echo ========================================================
echo  🚀 AI Stock Research Platform - Live Market Data Server
echo ========================================================
echo.
echo Starting local backend server on http://localhost:8000 ...
echo Real-time live quotes, 0ms CORS bypass, and instant data active!
echo.
cd /d "%~dp0backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
