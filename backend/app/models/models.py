"""
app/models/models.py — All SQLAlchemy ORM models for the AI Stock Research Platform.

Every table has UUID primary keys and appropriate created_at / updated_at timestamps.
"""

import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


def _uuid() -> str:
    """Generate a new UUID4 string (used as default for primary keys)."""
    return str(uuid.uuid4())


# ── 1. User ───────────────────────────────────────────────────────────────────
class User(Base):
    """Application user with subscription tier and role flags."""

    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    subscription_tier = Column(
        String(20), default="free", nullable=False
    )  # free | pro | pro_plus
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    watchlists = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")
    ai_analyses = relationship("AIAnalysis", back_populates="user")
    backtest_strategies = relationship(
        "BacktestStrategy", back_populates="user", cascade="all, delete-orphan"
    )


# ── 2. Exchange ───────────────────────────────────────────────────────────────
class Exchange(Base):
    """Stock exchange / market venue."""

    __tablename__ = "exchanges"

    id = Column(String(36), primary_key=True, default=_uuid)
    name = Column(String(255), nullable=False)
    short_name = Column(String(20), nullable=False, index=True)
    country = Column(String(100), nullable=False)
    currency = Column(String(10), nullable=False)
    mic_code = Column(String(10), nullable=True)  # ISO 10383 MIC
    timezone = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    stocks = relationship("Stock", back_populates="exchange")


# ── 3. Stock ──────────────────────────────────────────────────────────────────
class Stock(Base):
    """Listed equity instrument."""

    __tablename__ = "stocks"

    id = Column(String(36), primary_key=True, default=_uuid)
    ticker = Column(String(20), nullable=False, index=True)
    name = Column(String(500), nullable=False)
    exchange_id = Column(String(36), ForeignKey("exchanges.id"), nullable=True)
    sector = Column(String(255), nullable=True)
    industry = Column(String(255), nullable=True)
    country = Column(String(100), nullable=True)
    currency = Column(String(10), nullable=True)
    isin = Column(String(12), nullable=True)
    description = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    employees = Column(Integer, nullable=True)
    founded_year = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_demo_data = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    exchange = relationship("Exchange", back_populates="stocks")
    prices = relationship("Price", back_populates="stock", cascade="all, delete-orphan")
    financial_statements = relationship(
        "FinancialStatement", back_populates="stock", cascade="all, delete-orphan"
    )
    financial_ratios = relationship(
        "FinancialRatio", back_populates="stock", cascade="all, delete-orphan"
    )
    scores = relationship("StockScore", back_populates="stock", cascade="all, delete-orphan")
    fair_values = relationship("FairValue", back_populates="stock", cascade="all, delete-orphan")
    earnings = relationship("Earnings", back_populates="stock", cascade="all, delete-orphan")
    dividends = relationship("Dividend", back_populates="stock", cascade="all, delete-orphan")
    news = relationship("NewsArticle", back_populates="stock")
    analyst_estimates = relationship(
        "AnalystEstimate", back_populates="stock", cascade="all, delete-orphan"
    )
    watchlist_items = relationship("WatchlistItem", back_populates="stock")
    portfolio_positions = relationship("PortfolioPosition", back_populates="stock")
    alerts = relationship("Alert", back_populates="stock")
    ai_analyses = relationship("AIAnalysis", back_populates="stock")


# ── 4. Price ──────────────────────────────────────────────────────────────────
class Price(Base):
    """Daily OHLCV price bar for a stock."""

    __tablename__ = "prices"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    open = Column(Float, nullable=True)
    high = Column(Float, nullable=True)
    low = Column(Float, nullable=True)
    close = Column(Float, nullable=True)
    volume = Column(Float, nullable=True)
    adjusted_close = Column(Float, nullable=True)
    source = Column(String(50), nullable=True)
    data_freshness = Column(String(20), default="daily", nullable=False)
    # real_time | delayed | daily
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    stock = relationship("Stock", back_populates="prices")


# ── 5. FinancialStatement ─────────────────────────────────────────────────────
class FinancialStatement(Base):
    """Income, balance sheet, or cash flow statement for a reporting period."""

    __tablename__ = "financial_statements"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False, index=True)
    period = Column(String(10), nullable=False)  # annual | quarterly
    fiscal_year = Column(Integer, nullable=False)
    fiscal_quarter = Column(Integer, nullable=True)  # 1-4, null for annual
    statement_type = Column(String(20), nullable=False)  # income | balance | cashflow
    data = Column(JSON, nullable=False)  # all line items
    currency = Column(String(10), nullable=True)
    source = Column(String(50), nullable=True)
    retrieved_at = Column(DateTime, server_default=func.now(), nullable=False)
    is_demo_data = Column(Boolean, default=False, nullable=False)

    stock = relationship("Stock", back_populates="financial_statements")


# ── 6. FinancialRatio ─────────────────────────────────────────────────────────
class FinancialRatio(Base):
    """Calculated financial ratios for a reporting period."""

    __tablename__ = "financial_ratios"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False, index=True)
    period = Column(String(10), nullable=False)
    fiscal_year = Column(Integer, nullable=False)
    fiscal_quarter = Column(Integer, nullable=True)

    # Profitability
    roe = Column(Float, nullable=True)
    roa = Column(Float, nullable=True)
    roic = Column(Float, nullable=True)
    gross_margin = Column(Float, nullable=True)
    operating_margin = Column(Float, nullable=True)
    ebitda_margin = Column(Float, nullable=True)
    net_margin = Column(Float, nullable=True)

    # Liquidity
    current_ratio = Column(Float, nullable=True)
    quick_ratio = Column(Float, nullable=True)

    # Leverage
    debt_to_equity = Column(Float, nullable=True)
    interest_coverage = Column(Float, nullable=True)

    # Efficiency
    asset_turnover = Column(Float, nullable=True)

    # Valuation
    pe_ratio = Column(Float, nullable=True)
    forward_pe = Column(Float, nullable=True)
    pb_ratio = Column(Float, nullable=True)
    ps_ratio = Column(Float, nullable=True)
    ev_ebitda = Column(Float, nullable=True)
    ev_revenue = Column(Float, nullable=True)
    peg_ratio = Column(Float, nullable=True)
    fcf_yield = Column(Float, nullable=True)
    dividend_yield = Column(Float, nullable=True)

    source = Column(String(50), nullable=True)
    retrieved_at = Column(DateTime, server_default=func.now(), nullable=False)
    is_demo_data = Column(Boolean, default=False, nullable=False)

    stock = relationship("Stock", back_populates="financial_ratios")


# ── 7. StockScore ─────────────────────────────────────────────────────────────
class StockScore(Base):
    """Master composite stock score with component breakdown."""

    __tablename__ = "stock_scores"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False, index=True)
    scored_at = Column(DateTime, server_default=func.now(), nullable=False)

    overall_score = Column(Float, nullable=True)
    fundamental_score = Column(Float, nullable=True)
    valuation_score = Column(Float, nullable=True)
    growth_score = Column(Float, nullable=True)
    health_score = Column(Float, nullable=True)
    technical_score = Column(Float, nullable=True)
    momentum_score = Column(Float, nullable=True)
    dividend_score = Column(Float, nullable=True)
    risk_score = Column(Float, nullable=True)
    quality_score = Column(Float, nullable=True)
    analyst_score = Column(Float, nullable=True)

    # Quantitative models
    piotroski_score = Column(Integer, nullable=True)  # 0-9
    beneish_mscore = Column(Float, nullable=True)
    altman_zscore = Column(Float, nullable=True)

    score_weights = Column(JSON, nullable=True)
    calculation_details = Column(JSON, nullable=True)
    data_completeness_pct = Column(Float, nullable=True)
    confidence = Column(String(10), nullable=True)  # low | medium | high
    is_demo_data = Column(Boolean, default=False, nullable=False)

    stock = relationship("Stock", back_populates="scores")


# ── 8. FairValue ──────────────────────────────────────────────────────────────
class FairValue(Base):
    """Intrinsic / fair value estimate produced by a specific valuation method."""

    __tablename__ = "fair_values"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False, index=True)
    method = Column(String(20), nullable=False)
    # dcf | relative | fcf | ddm | historical | composite
    current_price = Column(Float, nullable=True)
    fair_value_low = Column(Float, nullable=True)
    fair_value_base = Column(Float, nullable=True)
    fair_value_high = Column(Float, nullable=True)
    upside_pct = Column(Float, nullable=True)
    assumptions = Column(JSON, nullable=True)
    calculated_at = Column(DateTime, server_default=func.now(), nullable=False)
    is_demo_data = Column(Boolean, default=False, nullable=False)

    stock = relationship("Stock", back_populates="fair_values")


# ── 9. Earnings ───────────────────────────────────────────────────────────────
class Earnings(Base):
    """Quarterly / annual earnings result including EPS and revenue."""

    __tablename__ = "earnings"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False, index=True)
    earnings_date = Column(Date, nullable=True)
    period = Column(String(10), nullable=True)
    fiscal_year = Column(Integer, nullable=True)
    fiscal_quarter = Column(Integer, nullable=True)

    eps_actual = Column(Float, nullable=True)
    eps_estimate = Column(Float, nullable=True)
    eps_surprise_pct = Column(Float, nullable=True)

    revenue_actual = Column(Float, nullable=True)
    revenue_estimate = Column(Float, nullable=True)
    revenue_surprise_pct = Column(Float, nullable=True)

    guidance_text = Column(Text, nullable=True)
    analyst_revisions = Column(JSON, nullable=True)
    source = Column(String(50), nullable=True)
    is_demo_data = Column(Boolean, default=False, nullable=False)

    stock = relationship("Stock", back_populates="earnings")


# ── 10. Dividend ──────────────────────────────────────────────────────────────
class Dividend(Base):
    """Dividend payment record for a stock."""

    __tablename__ = "dividends"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False, index=True)
    ex_date = Column(Date, nullable=True)
    pay_date = Column(Date, nullable=True)
    amount = Column(Float, nullable=True)
    frequency = Column(String(20), nullable=True)  # annual | semi-annual | quarterly
    dividend_yield = Column(Float, nullable=True)
    payout_ratio = Column(Float, nullable=True)
    fcf_coverage = Column(Float, nullable=True)
    source = Column(String(50), nullable=True)
    is_demo_data = Column(Boolean, default=False, nullable=False)

    stock = relationship("Stock", back_populates="dividends")


# ── 11. NewsArticle ───────────────────────────────────────────────────────────
class NewsArticle(Base):
    """News article with sentiment analysis."""

    __tablename__ = "news_articles"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=True, index=True)
    headline = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    url = Column(String(1000), nullable=True)
    source_name = Column(String(255), nullable=True)
    published_at = Column(DateTime, nullable=True)
    sentiment_score = Column(Float, nullable=True)  # -100 to 100
    sentiment_label = Column(String(10), nullable=True)  # positive | negative | neutral
    category = Column(String(50), nullable=True)
    topics = Column(JSON, nullable=True)  # list of topic strings
    is_demo_data = Column(Boolean, default=False, nullable=False)

    stock = relationship("Stock", back_populates="news")


# ── 12. EconomicEvent ─────────────────────────────────────────────────────────
class EconomicEvent(Base):
    """Macro-economic calendar event (e.g. CPI, GDP, Fed meeting)."""

    __tablename__ = "economic_events"

    id = Column(String(36), primary_key=True, default=_uuid)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    event_date = Column(DateTime, nullable=False)
    previous_value = Column(Float, nullable=True)
    forecast_value = Column(Float, nullable=True)
    actual_value = Column(Float, nullable=True)
    unit = Column(String(50), nullable=True)
    impact_level = Column(String(10), nullable=True)  # low | medium | high
    source = Column(String(50), nullable=True)
    is_demo_data = Column(Boolean, default=False, nullable=False)


# ── 13. AnalystEstimate ───────────────────────────────────────────────────────
class AnalystEstimate(Base):
    """Individual or consensus analyst rating and price target."""

    __tablename__ = "analyst_estimates"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False, index=True)
    analyst_name = Column(String(255), nullable=True)
    firm_name = Column(String(255), nullable=True)
    rating = Column(String(30), nullable=True)  # Buy | Hold | Sell | etc.
    target_price = Column(Float, nullable=True)
    previous_target = Column(Float, nullable=True)
    date = Column(Date, nullable=True)
    consensus_rating = Column(String(30), nullable=True)
    consensus_target = Column(Float, nullable=True)
    source = Column(String(50), nullable=True)
    is_demo_data = Column(Boolean, default=False, nullable=False)

    stock = relationship("Stock", back_populates="analyst_estimates")


# ── 14. Watchlist ─────────────────────────────────────────────────────────────
class Watchlist(Base):
    """User-defined watchlist container."""

    __tablename__ = "watchlists"

    id = Column(String(36), primary_key=True, default=_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user = relationship("User", back_populates="watchlists")
    items = relationship(
        "WatchlistItem", back_populates="watchlist", cascade="all, delete-orphan"
    )


# ── 15. WatchlistItem ─────────────────────────────────────────────────────────
class WatchlistItem(Base):
    """A stock entry within a watchlist."""

    __tablename__ = "watchlist_items"

    id = Column(String(36), primary_key=True, default=_uuid)
    watchlist_id = Column(
        String(36), ForeignKey("watchlists.id"), nullable=False, index=True
    )
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False)
    added_at = Column(DateTime, server_default=func.now(), nullable=False)
    notes = Column(Text, nullable=True)

    watchlist = relationship("Watchlist", back_populates="items")
    stock = relationship("Stock", back_populates="watchlist_items")


# ── 16. Portfolio ─────────────────────────────────────────────────────────────
class Portfolio(Base):
    """User investment portfolio."""

    __tablename__ = "portfolios"

    id = Column(String(36), primary_key=True, default=_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    currency = Column(String(10), default="INR", nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user = relationship("User", back_populates="portfolios")
    positions = relationship(
        "PortfolioPosition", back_populates="portfolio", cascade="all, delete-orphan"
    )


# ── 17. PortfolioPosition ─────────────────────────────────────────────────────
class PortfolioPosition(Base):
    """A single equity position within a portfolio."""

    __tablename__ = "portfolio_positions"

    id = Column(String(36), primary_key=True, default=_uuid)
    portfolio_id = Column(
        String(36), ForeignKey("portfolios.id"), nullable=False, index=True
    )
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    buy_price = Column(Float, nullable=False)
    buy_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    is_closed = Column(Boolean, default=False, nullable=False)
    sell_price = Column(Float, nullable=True)
    sell_date = Column(Date, nullable=True)

    portfolio = relationship("Portfolio", back_populates="positions")
    stock = relationship("Stock", back_populates="portfolio_positions")


# ── 18. Alert ─────────────────────────────────────────────────────────────────
class Alert(Base):
    """User-configured price / metric / event alert."""

    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=True, index=True)
    alert_type = Column(String(30), nullable=False)
    # price | pct_change | rsi | 52w_high | 52w_low | earnings | fair_value | score | technical
    condition = Column(String(10), nullable=False)  # above | below | crosses
    threshold_value = Column(Float, nullable=True)
    is_triggered = Column(Boolean, default=False, nullable=False)
    triggered_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    notification_sent = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="alerts")
    stock = relationship("Stock", back_populates="alerts")


# ── 19. BacktestStrategy ──────────────────────────────────────────────────────
class BacktestStrategy(Base):
    """User-saved strategy configuration for backtesting."""

    __tablename__ = "backtest_strategies"

    id = Column(String(36), primary_key=True, default=_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    universe_filter = Column(JSON, nullable=True)
    entry_rules = Column(JSON, nullable=True)
    exit_rules = Column(JSON, nullable=True)
    holding_period_days = Column(Integer, nullable=True)
    rebalance_freq = Column(String(20), nullable=True)
    stop_loss_pct = Column(Float, nullable=True)
    take_profit_pct = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="backtest_strategies")
    results = relationship(
        "BacktestResult", back_populates="strategy", cascade="all, delete-orphan"
    )


# ── 20. BacktestResult ────────────────────────────────────────────────────────
class BacktestResult(Base):
    """Backtest run result with performance metrics."""

    __tablename__ = "backtest_results"

    id = Column(String(36), primary_key=True, default=_uuid)
    strategy_id = Column(
        String(36), ForeignKey("backtest_strategies.id"), nullable=False, index=True
    )
    run_at = Column(DateTime, server_default=func.now(), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    initial_capital = Column(Float, nullable=False)
    final_capital = Column(Float, nullable=True)
    total_return_pct = Column(Float, nullable=True)
    cagr_pct = Column(Float, nullable=True)
    max_drawdown_pct = Column(Float, nullable=True)
    sharpe_ratio = Column(Float, nullable=True)
    win_rate_pct = Column(Float, nullable=True)
    num_trades = Column(Integer, nullable=True)
    transaction_cost_pct = Column(Float, nullable=True)
    result_data = Column(JSON, nullable=True)  # portfolio curve, trades list
    is_demo_data = Column(Boolean, default=False, nullable=False)

    strategy = relationship("BacktestStrategy", back_populates="results")


# ── 21. AIAnalysis ────────────────────────────────────────────────────────────
class AIAnalysis(Base):
    """Stored AI-generated analysis result."""

    __tablename__ = "ai_analyses"

    id = Column(String(36), primary_key=True, default=_uuid)
    stock_id = Column(String(36), ForeignKey("stocks.id"), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    query_text = Column(Text, nullable=True)
    analysis_type = Column(String(20), nullable=False)
    # stock | compare | report | chat | screener
    response_json = Column(JSON, nullable=True)
    model_used = Column(String(100), nullable=True)
    tokens_used = Column(Integer, nullable=True)
    data_timestamp = Column(DateTime, nullable=True)
    confidence = Column(String(10), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    stock = relationship("Stock", back_populates="ai_analyses")
    user = relationship("User", back_populates="ai_analyses")


# ── 22. DataSource ────────────────────────────────────────────────────────────
class DataSource(Base):
    """Provenance record for any data point stored in the platform."""

    __tablename__ = "data_sources"

    id = Column(String(36), primary_key=True, default=_uuid)
    entity_type = Column(String(50), nullable=False)  # stock | economic_event | etc.
    entity_id = Column(String(36), nullable=False, index=True)
    metric_name = Column(String(100), nullable=True)
    source_name = Column(String(100), nullable=False)
    source_url = Column(String(1000), nullable=True)
    retrieved_at = Column(DateTime, nullable=False)
    data_period = Column(String(50), nullable=True)
    currency = Column(String(10), nullable=True)
    unit = Column(String(50), nullable=True)
    confidence = Column(String(10), nullable=True)
    is_primary = Column(Boolean, default=True, nullable=False)
    is_demo_data = Column(Boolean, default=False, nullable=False)


# ── 23. AdminLog ──────────────────────────────────────────────────────────────
class AdminLog(Base):
    """Audit log for administrative actions and system events."""

    __tablename__ = "admin_logs"

    id = Column(String(36), primary_key=True, default=_uuid)
    event_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
