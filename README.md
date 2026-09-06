# StockIQ — AI Stock Research & Analysis Platform

A production-ready, AI-powered stock research and analysis web application. Think of it as a professional financial research terminal for individual investors and quantitative researchers.

> **⚠️ DISCLAIMER**: This platform provides research and educational information and is NOT financial advice. Market data may be delayed or inaccurate. Predictions and scores are model outputs, not guarantees. Users should independently verify information before making investment decisions.

---

## Features

- **Stock Discovery & Research** — Search stocks by name, ticker, ISIN across NSE/BSE/NYSE/NASDAQ
- **Fundamental Analysis** — Revenue, EPS, margins, ROE, ROIC, FCF, balance sheet
- **Financial Health Engine** — Piotroski F-Score, Beneish M-Score, Altman Z-Score
- **Valuation Engine** — DCF, relative valuation, fair value range, Bear/Base/Bull scenarios
- **Technical Analysis** — SMA/EMA, RSI, MACD, Bollinger Bands, ATR, technical score
- **AI Research Assistant** — Ask questions about any stock, get structured analysis
- **Advanced Screener** — 50+ filters, AND/OR logic, pre-built strategy templates
- **Portfolio Tracker** — P&L, allocation, risk analysis, AI portfolio review
- **Watchlists & Alerts** — Price, RSI, earnings, fair-value threshold alerts
- **Earnings & Dividend Calendars** — Upcoming events with estimates and actuals
- **Economic Calendar** — CPI, GDP, NFP, interest rates with macro impact analysis
- **Backtesting Engine** — Test fundamental + technical strategies on historical data
- **Market Dashboard** — Indices, sector performance, top movers, breadth
- **Explainable Scores** — Every recommendation shows WHY with full data transparency

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| State | Zustand |
| Charts | TradingView Lightweight Charts + Recharts |
| Backend | Python 3.12 + FastAPI (async) |
| ORM | SQLAlchemy 2.0 + Alembic |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Task Queue | APScheduler |
| AI | OpenAI GPT-4o / Google Gemini (configurable) |
| Auth | JWT + bcrypt |
| Containers | Docker + Docker Compose |

---

## Quick Start

### Option 1 — Docker (Recommended)

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env — at minimum set SECRET_KEY. Leave DATA_PROVIDER_MODE=mock for demo.

# 2. Start all services
docker-compose up -d

# 3. Open the app
open http://localhost:3000
```

### Option 2 — Local Development (no Docker)

**Prerequisites**: Python 3.12+, Node.js 20+, PostgreSQL 16, Redis 7

```bash
# ── Backend ────────────────────────────────────
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy and configure environment
cp ../.env.example ../.env
# Edit .env

# Run database migrations
alembic upgrade head

# Start backend
uvicorn app.main:app --reload --port 8000

# ── Frontend (new terminal) ─────────────────────
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:8000  
API Docs: http://localhost:8000/docs

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATA_PROVIDER_MODE` | `mock` (demo) or `live` (real APIs) | `mock` |
| `MARKET_DATA_API_KEY` | Alpha Vantage API key | — |
| `FUNDAMENTAL_DATA_API_KEY` | Financial Modeling Prep key | — |
| `NEWS_API_KEY` | NewsAPI.org key | — |
| `ECONOMIC_DATA_API_KEY` | FRED API key | — |
| `AI_API_KEY` | OpenAI / Gemini API key | — |
| `AI_PROVIDER` | `openai` / `gemini` / `anthropic` | `openai` |
| `SECRET_KEY` | JWT signing secret (min 32 chars) | **CHANGE THIS** |

See `.env.example` for the full list.

---

## Demo Mode

When `DATA_PROVIDER_MODE=mock`, the platform uses a built-in mock data provider with realistic (but fictional) stock data clearly labelled as **[DEMO DATA]**. No API keys required.

To use real market data, set `DATA_PROVIDER_MODE=live` and add your API keys.

**Free API sources to get started:**
- [Alpha Vantage](https://www.alphavantage.co/support/#api-key) — free market data
- [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs) — free fundamentals
- [NewsAPI](https://newsapi.org/register) — free news
- [FRED](https://fred.stlouisfed.org/docs/api/api_key.html) — free economic data
- [Yahoo Finance](https://github.com/ranaroussi/yfinance) — free via yfinance (no key needed)

---

## API Documentation

After starting the backend, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Project Structure

```
stock-research-platform/
├── backend/             # FastAPI Python backend
│   ├── app/
│   │   ├── api/         # Route handlers
│   │   ├── core/        # Config, auth, database
│   │   ├── models/      # SQLAlchemy ORM models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   │   ├── financial_engine/   # Ratios, valuation, scoring
│   │   │   ├── ai_engine/          # AI analysis, prompts, reports
│   │   │   └── screener/           # Filter + ranking engine
│   │   └── providers/   # Data provider abstraction
│   │       ├── base.py  # Abstract interfaces
│   │       ├── mock/    # Demo data provider
│   │       ├── yahoo_finance/
│   │       ├── financial_modeling_prep/
│   │       └── fred/
│   └── tests/
├── frontend/            # React TypeScript frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page-level components
│       ├── store/       # Zustand state stores
│       ├── api/         # API client
│       └── types/       # TypeScript types
├── database/
│   └── schema.sql       # PostgreSQL schema
├── .env.example
└── docker-compose.yml
```

---

## Running Tests

```bash
cd backend
pytest tests/ -v --cov=app
```

---

## Data Quality & Disclaimers

- All data points include source, timestamp, and freshness classification
- Delayed data is clearly marked as DELAYED (not real-time)
- AI analysis confidence ratings (LOW/MEDIUM/HIGH) depend on data completeness
- Fair value estimates are model-dependent and not guaranteed future prices
- Scores are research tools, not trading signals

---

## License

This project is for educational and research purposes. Not for commercial redistribution of financial data.
