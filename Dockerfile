# Ultra-fast, lightweight Production Dockerfile for Render Free Tier (512MB RAM safe)
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies (ReportLab fonts, compilation tools, curl)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libfreetype6-dev \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy Backend Source Code
COPY backend/ ./backend/

# Copy Pre-built Frontend Dist (bypasses heavy Node/NPM build memory crash on Render Free Tier)
COPY frontend/dist ./frontend/dist

# Set Working Directory to backend
WORKDIR /app/backend

# Environment variables default
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

# Start FastAPI server (serves API + React frontend + Telegram bot)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
