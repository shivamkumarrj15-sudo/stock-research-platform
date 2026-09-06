"""
AI Stock Research Platform — FastAPI Backend
Main application entry point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
import time

from app.core.config import settings
from app.core.database import init_db

# Routers
from app.api import auth, stocks, screener, watchlist, portfolio, alerts
from app.api import calendar, news, ai_research, backtesting, admin

logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: startup and shutdown events."""
    # Startup
    logger.info(f"Starting {settings.APP_NAME} in {settings.APP_ENV} mode")
    logger.info(f"Data provider mode: {settings.DATA_PROVIDER_MODE}")

    try:
        from app.providers.base import ProviderRegistry
        ProviderRegistry.initialize(settings)
        await init_db()
        logger.info("Database & Data Providers initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down application")


app = FastAPI(
    title=settings.APP_NAME,
    description="""
    ## AI Stock Research & Analysis Platform

    A professional financial research platform combining:
    - Stock discovery and screening
    - Fundamental and technical analysis
    - AI-powered research assistant
    - Valuation engine with fair value estimates
    - Portfolio and watchlist management
    - Economic calendar

    **⚠️ DISCLAIMER**: This platform provides research and educational information only.
    It is NOT financial advice. All scores and valuations are model outputs, not guarantees.

    ### Data Mode
    When `DATA_PROVIDER_MODE=mock`, all data is clearly labelled as **DEMO DATA**.
    Set to `live` and provide API keys to use real market data.
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── Rate Limiting ─────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Timing Middleware ─────────────────────────────────────────────────
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
    return response


# ── Global Exception Handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again.",
            "path": str(request.url),
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url),
        },
    )


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(stocks.router, prefix="/api", tags=["Stocks & Market"])
app.include_router(screener.router, prefix="/api/screener", tags=["Screener"])
app.include_router(watchlist.router, prefix="/api/watchlists", tags=["Watchlists"])
app.include_router(portfolio.router, prefix="/api/portfolios", tags=["Portfolio"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["Calendar"])
app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(ai_research.router, prefix="/api/ai", tags=["AI Research"])
app.include_router(backtesting.router, prefix="/api/backtesting", tags=["Backtesting"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


# ── Health & Info Endpoints ───────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "environment": settings.APP_ENV,
    }


@app.get("/api/info", tags=["System"])
async def api_info():
    """API information and current configuration (non-sensitive)."""
    return {
        "app_name": settings.APP_NAME,
        "version": "1.0.0",
        "data_provider_mode": settings.DATA_PROVIDER_MODE,
        "is_demo_mode": settings.DATA_PROVIDER_MODE == "mock",
        "demo_mode_notice": (
            "DEMO MODE: All data shown is simulated for demonstration purposes. "
            "Set DATA_PROVIDER_MODE=live and configure API keys for real market data."
            if settings.DATA_PROVIDER_MODE == "mock"
            else None
        ),
        "ai_provider": settings.AI_PROVIDER if settings.AI_API_KEY else "not_configured",
        "disclaimer": (
            "This platform provides research and educational information only. "
            "It is NOT financial advice. Scores and valuations are model outputs, "
            "not guarantees of future performance."
        ),
    }
