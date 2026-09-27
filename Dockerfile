# Multi-stage Dockerfile for StockIQ Institutional Research Platform on Render
# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend + Telegram Bot + Static Frontend Server
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies (fonts for ReportLab PDF generation, curl)
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

# Copy Built Frontend from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set Working Directory to backend
WORKDIR /app/backend

# Environment variables default
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

# Start FastAPI (which also automatically launches Telegram Bot & Serves Frontend)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
