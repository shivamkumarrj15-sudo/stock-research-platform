"""
app/core/config.py — Application configuration via Pydantic Settings.

All settings can be overridden with environment variables or a .env file.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application configuration loaded from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ── Application ──────────────────────────────────────────────────────────
    APP_NAME: str = "AI Stock Research Platform"
    APP_ENV: str = "development"  # development | staging | production
    DEBUG: bool = True
    VERSION: str = "1.0.0"

    # ── Security ─────────────────────────────────────────────────────────────
    SECRET_KEY: str = "super-secret-key-change-in-production-min-32-chars-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── Database ─────────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./stock_research.db"
    # For PostgreSQL: postgresql+asyncpg://user:pass@host/dbname

    # ── Redis ────────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── Data Provider Mode ───────────────────────────────────────────────────
    DATA_PROVIDER_MODE: str = "mock"  # mock | live

    # ── Market Data Provider ─────────────────────────────────────────────────
    MARKET_DATA_PROVIDER: str = "angel_one"  # angel_one | yahoo_finance | alpha_vantage | fmp
    MARKET_DATA_API_KEY: str = ""
    ANGELONE_API_KEY: str = "kHrodFlM"
    ANGELONE_CLIENT_CODE: str = ""
    ANGELONE_PASSWORD: str = ""
    ANGELONE_TOTP_KEY: str = ""

    # ── Fundamental Data Provider ─────────────────────────────────────────────
    FUNDAMENTAL_DATA_PROVIDER: str = "yahoo_finance"
    FUNDAMENTAL_DATA_API_KEY: str = ""

    # ── News Provider ────────────────────────────────────────────────────────
    NEWS_PROVIDER: str = "newsapi"  # newsapi | finnhub
    NEWS_API_KEY: str = ""

    # ── Economic Data Provider ───────────────────────────────────────────────
    ECONOMIC_DATA_PROVIDER: str = "fred"  # fred | world_bank
    ECONOMIC_DATA_API_KEY: str = ""

    # ── Earnings & Analyst Data ───────────────────────────────────────────────
    EARNINGS_PROVIDER: str = "yahoo_finance"
    ANALYST_DATA_PROVIDER: str = "yahoo_finance"

    # ── AI Provider ──────────────────────────────────────────────────────────
    AI_PROVIDER: str = "mock"  # mock | openai | gemini | anthropic
    AI_API_KEY: str = ""
    AI_MODEL: str = "gpt-4o"

    # ── Rate Limiting ────────────────────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60
    AI_RATE_LIMIT_PER_MINUTE: int = 10

    # ── Cache TTLs (seconds) ─────────────────────────────────────────────────
    PRICE_CACHE_TTL: int = 30
    FUNDAMENTALS_CACHE_TTL: int = 3600
    SCORES_CACHE_TTL: int = 1800
    NEWS_CACHE_TTL: int = 300
    SCREENER_CACHE_TTL: int = 600

    # ── CORS ─────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]


# Singleton settings instance used throughout the application
settings = Settings()
