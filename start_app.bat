@echo off
title StockIQ Institutional Equity Research Platform
echo ========================================================
echo   Launching StockIQ Institutional AI Research Platform
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start /B "" "backend\venv\Scripts\python.exe" -m uvicorn app.main:app --port 8000 --host 0.0.0.0

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Web Interface on http://localhost:5173 ...
cd frontend
start "" npm.cmd run dev

echo.
echo ========================================================
echo   Platform is LIVE!
echo   Frontend : http://localhost:5173
echo   API Docs : http://localhost:8000/docs
echo ========================================================
pause
