"""
app/schemas/schemas.py — Pydantic v2 request/response schemas for all API endpoints.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, List, Optional, Union
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


# ─────────────────────────────────────────────────────────────────────────────
# Shared helpers
# ─────────────────────────────────────────────────────────────────────────────
class OrmBase(BaseModel):
    """All response schemas inherit from this to enable ORM mode."""

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Auth / User
# ─────────────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    """Payload for user registration."""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: Optional[str] = None


class UserUpdate(BaseModel):
    """Partial update for user profile."""

    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8, max_length=128)


class UserLogin(BaseModel):
    """Credentials for login."""

    email: EmailStr
    password: str


class UserResponse(OrmBase):
    """Public user profile returned from the API."""

    id: str
    email: str
    full_name: Optional[str]
    is_active: bool
    is_admin: bool
    subscription_tier: str
    created_at: datetime


class TokenResponse(BaseModel):
    """JWT token pair returned on login or refresh."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshRequest(BaseModel):
    refresh_token: str


# ─────────────────────────────────────────────────────────────────────────────
# Exchange
# ─────────────────────────────────────────────────────────────────────────────
class ExchangeResponse(OrmBase):
    id: str
    name: str
    short_name: str
    country: str
    currency: str
    mic_code: Optional[str]
    timezone: Optional[str]
    is_active: bool


# ─────────────────────────────────────────────────────────────────────────────
# Stock
# ─────────────────────────────────────────────────────────────────────────────
class StockSearch(BaseModel):
    """Lightweight search result."""

    ticker: str
    name: str
    exchange: Optional[str]
    sector: Optional[str]
    country: Optional[str]
    currency: Optional[str]
    is_demo_data: bool = False


class StockResponse(OrmBase):
    """Standard stock response."""

    id: str
    ticker: str
    name: str
    sector: Optional[str]
    industry: Optional[str]
    country: Optional[str]
    currency: Optional[str]
    isin: Optional[str]
    is_demo_data: bool


class StockProfile(OrmBase):
    """Detailed stock profile including description and fundamentals."""

    id: str
    ticker: str
    name: str
    exchange_id: Optional[str]
    sector: Optional[str]
    industry: Optional[str]
    country: Optional[str]
    currency: Optional[str]
    isin: Optional[str]
    description: Optional[str]
    website: Optional[str]
    employees: Optional[int]
    founded_year: Optional[int]
    is_active: bool
    is_demo_data: bool
    created_at: datetime
    updated_at: datetime


# ─────────────────────────────────────────────────────────────────────────────
# Price
# ─────────────────────────────────────────────────────────────────────────────
class PriceResponse(OrmBase):
    """Single OHLCV bar."""

    id: str
    stock_id: str
    date: date
    open: Optional[float]
    high: Optional[float]
    low: Optional[float]
    close: Optional[float]
    volume: Optional[float]
    adjusted_close: Optional[float]
    source: Optional[str]
    data_freshness: str


class PriceHistory(BaseModel):
    """Collection of OHLCV bars with metadata."""

    ticker: str
    interval: str
    from_date: date
    to_date: date
    bars: List[PriceResponse]
    is_demo_data: bool = False
    source: str = ""


class CurrentPrice(BaseModel):
    """Real-time or delayed current price snapshot."""

    ticker: str
    price: float
    open: Optional[float]
    high: Optional[float]
    low: Optional[float]
    volume: Optional[float]
    change: Optional[float]
    change_pct: Optional[float]
    market_cap: Optional[float]
    pe_ratio: Optional[float]
    week_52_high: Optional[float]
    week_52_low: Optional[float]
    data_freshness: str
    is_demo_data: bool = False
    retrieved_at: str


# ─────────────────────────────────────────────────────────────────────────────
# Financial Statements
# ─────────────────────────────────────────────────────────────────────────────
class FinancialStatementResponse(OrmBase):
    id: str
    stock_id: str
    period: str
    fiscal_year: int
    fiscal_quarter: Optional[int]
    statement_type: str
    data: Dict[str, Any]
    currency: Optional[str]
    source: Optional[str]
    retrieved_at: datetime
    is_demo_data: bool


# ─────────────────────────────────────────────────────────────────────────────
# Financial Ratios
# ─────────────────────────────────────────────────────────────────────────────
class FinancialRatioResponse(OrmBase):
    id: str
    stock_id: str
    period: str
    fiscal_year: int
    fiscal_quarter: Optional[int]
    roe: Optional[float]
    roa: Optional[float]
    roic: Optional[float]
    gross_margin: Optional[float]
    operating_margin: Optional[float]
    ebitda_margin: Optional[float]
    net_margin: Optional[float]
    current_ratio: Optional[float]
    quick_ratio: Optional[float]
    debt_to_equity: Optional[float]
    interest_coverage: Optional[float]
    asset_turnover: Optional[float]
    pe_ratio: Optional[float]
    forward_pe: Optional[float]
    pb_ratio: Optional[float]
    ps_ratio: Optional[float]
    ev_ebitda: Optional[float]
    ev_revenue: Optional[float]
    peg_ratio: Optional[float]
    fcf_yield: Optional[float]
    dividend_yield: Optional[float]
    source: Optional[str]
    retrieved_at: datetime
    is_demo_data: bool


# ─────────────────────────────────────────────────────────────────────────────
# Piotroski F-Score
# ─────────────────────────────────────────────────────────────────────────────
class PiotroskiItem(BaseModel):
    name: str
    description: str
    value: Optional[float]
    passed: bool
    formula: str
    points: int  # 0 or 1


class PiotroskiScore(BaseModel):
    """Full Piotroski F-Score result with all 9 criteria."""

    score: int = Field(..., ge=0, le=9)
    items: List[PiotroskiItem]
    interpretation: str
    risk_level: str  # low | medium | high
    is_demo_data: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Beneish M-Score
# ─────────────────────────────────────────────────────────────────────────────
class BeneishVariable(BaseModel):
    name: str
    full_name: str
    value: Optional[float]
    explanation: str


class BeneishMScore(BaseModel):
    """Beneish M-Score earnings manipulation risk indicator."""

    score: Optional[float]
    risk_level: str  # low | moderate | high
    variables: List[BeneishVariable]
    disclaimer: str
    is_demo_data: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Altman Z-Score
# ─────────────────────────────────────────────────────────────────────────────
class AltmanVariable(BaseModel):
    name: str
    description: str
    value: Optional[float]
    weight: float
    weighted_value: Optional[float]


class AltmanZScore(BaseModel):
    """Altman Z-Score bankruptcy risk indicator."""

    score: Optional[float]
    zone: str  # safe | grey | distress
    risk_level: str
    variables: List[AltmanVariable]
    trend: Optional[List[Dict[str, Any]]]
    disclaimer: str
    is_demo_data: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Stock Score
# ─────────────────────────────────────────────────────────────────────────────
class StockScoreResponse(OrmBase):
    """Complete master stock score with all component details."""

    id: str
    stock_id: str
    scored_at: datetime
    overall_score: Optional[float]
    fundamental_score: Optional[float]
    valuation_score: Optional[float]
    growth_score: Optional[float]
    health_score: Optional[float]
    technical_score: Optional[float]
    momentum_score: Optional[float]
    dividend_score: Optional[float]
    risk_score: Optional[float]
    quality_score: Optional[float]
    analyst_score: Optional[float]
    piotroski_score: Optional[int]
    beneish_mscore: Optional[float]
    altman_zscore: Optional[float]
    score_weights: Optional[Dict[str, Any]]
    calculation_details: Optional[Dict[str, Any]]
    data_completeness_pct: Optional[float]
    confidence: Optional[str]
    classification: Optional[str]  # Excellent | Strong | Watchlist | Weak | High Risk
    is_demo_data: bool


# ─────────────────────────────────────────────────────────────────────────────
# Fair Value / Valuation
# ─────────────────────────────────────────────────────────────────────────────
class ValuationScenario(BaseModel):
    label: str  # bear | base | bull
    fair_value: float
    upside_pct: float
    key_assumptions: Dict[str, Any]


class FairValueResponse(OrmBase):
    id: str
    stock_id: str
    method: str
    current_price: Optional[float]
    fair_value_low: Optional[float]
    fair_value_base: Optional[float]
    fair_value_high: Optional[float]
    upside_pct: Optional[float]
    assumptions: Optional[Dict[str, Any]]
    calculated_at: datetime
    is_demo_data: bool


class ValuationSummary(BaseModel):
    """Full valuation summary with all methods and scenarios."""

    ticker: str
    current_price: float
    methods: List[FairValueResponse]
    composite: Optional[FairValueResponse]
    scenarios: Optional[Dict[str, ValuationScenario]]
    is_demo_data: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Earnings
# ─────────────────────────────────────────────────────────────────────────────
class EarningsResponse(OrmBase):
    id: str
    stock_id: str
    earnings_date: Optional[date]
    period: Optional[str]
    fiscal_year: Optional[int]
    fiscal_quarter: Optional[int]
    eps_actual: Optional[float]
    eps_estimate: Optional[float]
    eps_surprise_pct: Optional[float]
    revenue_actual: Optional[float]
    revenue_estimate: Optional[float]
    revenue_surprise_pct: Optional[float]
    guidance_text: Optional[str]
    analyst_revisions: Optional[Dict[str, Any]]
    source: Optional[str]
    is_demo_data: bool


# ─────────────────────────────────────────────────────────────────────────────
# Dividends
# ─────────────────────────────────────────────────────────────────────────────
class DividendResponse(OrmBase):
    id: str
    stock_id: str
    ex_date: Optional[date]
    pay_date: Optional[date]
    amount: Optional[float]
    frequency: Optional[str]
    dividend_yield: Optional[float]
    payout_ratio: Optional[float]
    fcf_coverage: Optional[float]
    source: Optional[str]
    is_demo_data: bool


# ─────────────────────────────────────────────────────────────────────────────
# News
# ─────────────────────────────────────────────────────────────────────────────
class NewsArticleResponse(OrmBase):
    id: str
    stock_id: Optional[str]
    headline: str
    summary: Optional[str]
    url: Optional[str]
    source_name: Optional[str]
    published_at: Optional[datetime]
    sentiment_score: Optional[float]
    sentiment_label: Optional[str]
    category: Optional[str]
    topics: Optional[List[str]]
    is_demo_data: bool


class SentimentSummary(BaseModel):
    ticker: str
    avg_sentiment_score: float
    sentiment_label: str
    positive_count: int
    negative_count: int
    neutral_count: int
    recent_articles: List[NewsArticleResponse]
    is_demo_data: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Economic Events
# ─────────────────────────────────────────────────────────────────────────────
class EconomicEventResponse(OrmBase):
    id: str
    name: str
    country: Optional[str]
    category: Optional[str]
    event_date: datetime
    previous_value: Optional[float]
    forecast_value: Optional[float]
    actual_value: Optional[float]
    unit: Optional[str]
    impact_level: Optional[str]
    source: Optional[str]
    is_demo_data: bool


# ─────────────────────────────────────────────────────────────────────────────
# Analyst Estimates
# ─────────────────────────────────────────────────────────────────────────────
class AnalystEstimateResponse(OrmBase):
    id: str
    stock_id: str
    analyst_name: Optional[str]
    firm_name: Optional[str]
    rating: Optional[str]
    target_price: Optional[float]
    previous_target: Optional[float]
    date: Optional[date]
    consensus_rating: Optional[str]
    consensus_target: Optional[float]
    source: Optional[str]
    is_demo_data: bool


# ─────────────────────────────────────────────────────────────────────────────
# Watchlists
# ─────────────────────────────────────────────────────────────────────────────
class WatchlistCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class WatchlistUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None


class WatchlistItemResponse(OrmBase):
    id: str
    watchlist_id: str
    stock_id: str
    added_at: datetime
    notes: Optional[str]
    stock: Optional[StockResponse]


class WatchlistResponse(OrmBase):
    id: str
    user_id: str
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    item_count: int = 0


class WatchlistWithItems(OrmBase):
    id: str
    user_id: str
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    items: List[WatchlistItemResponse] = []


class AddToWatchlistRequest(BaseModel):
    ticker: str
    notes: Optional[str] = None


# ─────────────────────────────────────────────────────────────────────────────
# Portfolio
# ─────────────────────────────────────────────────────────────────────────────
class PortfolioCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    currency: str = "INR"


class PortfolioUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    currency: Optional[str] = None


class PositionCreate(BaseModel):
    ticker: str
    quantity: float = Field(..., gt=0)
    buy_price: float = Field(..., gt=0)
    buy_date: Optional[date] = None
    notes: Optional[str] = None


class PositionUpdate(BaseModel):
    quantity: Optional[float] = Field(None, gt=0)
    buy_price: Optional[float] = Field(None, gt=0)
    buy_date: Optional[date] = None
    notes: Optional[str] = None
    is_closed: Optional[bool] = None
    sell_price: Optional[float] = None
    sell_date: Optional[date] = None


class PortfolioPositionResponse(OrmBase):
    id: str
    portfolio_id: str
    stock_id: str
    quantity: float
    buy_price: float
    buy_date: Optional[date]
    notes: Optional[str]
    is_closed: bool
    sell_price: Optional[float]
    sell_date: Optional[date]
    stock: Optional[StockResponse]
    # Computed fields (enriched at API layer)
    current_price: Optional[float] = None
    current_value: Optional[float] = None
    gain_loss: Optional[float] = None
    gain_loss_pct: Optional[float] = None


class PortfolioResponse(OrmBase):
    id: str
    user_id: str
    name: str
    description: Optional[str]
    currency: str
    created_at: datetime
    updated_at: datetime
    position_count: int = 0
    total_invested: Optional[float] = None
    current_value: Optional[float] = None


class PortfolioWithPositions(OrmBase):
    id: str
    user_id: str
    name: str
    description: Optional[str]
    currency: str
    created_at: datetime
    updated_at: datetime
    positions: List[PortfolioPositionResponse] = []
    total_invested: Optional[float] = None
    current_value: Optional[float] = None
    total_gain_loss: Optional[float] = None
    total_gain_loss_pct: Optional[float] = None


class PortfolioAnalysis(BaseModel):
    """AI-powered portfolio analysis."""

    portfolio_id: str
    sector_allocation: Dict[str, float]
    country_allocation: Dict[str, float]
    top_holdings: List[Dict[str, Any]]
    concentration_risk: str
    diversification_score: float
    risk_level: str
    suggestions: List[str]
    is_demo_data: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Alerts
# ─────────────────────────────────────────────────────────────────────────────
class AlertCreate(BaseModel):
    ticker: Optional[str] = None
    alert_type: str
    condition: str  # above | below | crosses
    threshold_value: Optional[float] = None


class AlertUpdate(BaseModel):
    condition: Optional[str] = None
    threshold_value: Optional[float] = None
    is_active: Optional[bool] = None


class AlertResponse(OrmBase):
    id: str
    user_id: str
    stock_id: Optional[str]
    alert_type: str
    condition: str
    threshold_value: Optional[float]
    is_triggered: bool
    triggered_at: Optional[datetime]
    is_active: bool
    notification_sent: bool
    created_at: datetime


# ─────────────────────────────────────────────────────────────────────────────
# Screener
# ─────────────────────────────────────────────────────────────────────────────
class ScreenerFilter(BaseModel):
    """A single screener filter condition."""

    field: str
    operator: str  # > < >= <= == between in
    value: Union[float, str, List[float]] = Field(...)
    logic: str = "AND"  # AND | OR


class ScreenerRequest(BaseModel):
    """Full screener request payload."""

    filters: List[ScreenerFilter] = []
    sort_by: str = "overall_score"
    sort_direction: str = "desc"  # asc | desc
    limit: int = Field(50, ge=1, le=200)
    offset: int = Field(0, ge=0)
    exchange: Optional[str] = None
    sector: Optional[str] = None


class ScreenerResult(BaseModel):
    """A single stock result from the screener."""

    ticker: str
    name: str
    sector: Optional[str]
    country: Optional[str]
    exchange: Optional[str]
    # Key metrics
    market_cap: Optional[float]
    price: Optional[float]
    roic: Optional[float]
    roe: Optional[float]
    gross_margin: Optional[float]
    net_margin: Optional[float]
    revenue_growth: Optional[float]
    eps_growth: Optional[float]
    pe_ratio: Optional[float]
    pb_ratio: Optional[float]
    peg_ratio: Optional[float]
    debt_to_equity: Optional[float]
    current_ratio: Optional[float]
    dividend_yield: Optional[float]
    fcf_yield: Optional[float]
    fair_value_upside: Optional[float]
    overall_score: Optional[float]
    piotroski_score: Optional[int]
    technical_score: Optional[float]
    is_demo_data: bool = False


class ScreenerResponse(BaseModel):
    total_count: int
    returned_count: int
    results: List[ScreenerResult]
    filters_applied: List[ScreenerFilter]
    is_demo_data: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# AI Analysis
# ─────────────────────────────────────────────────────────────────────────────
class AIAnalysisRequest(BaseModel):
    ticker: str
    include_technical: bool = True
    include_news: bool = True


class AICompareRequest(BaseModel):
    tickers: List[str] = Field(..., min_length=2, max_length=5)


class AIReportRequest(BaseModel):
    ticker: str


class AIChatMessage(BaseModel):
    role: str  # user | assistant
    content: str


class AIChatRequest(BaseModel):
    message: str
    history: List[AIChatMessage] = []
    context_ticker: Optional[str] = None


class AIScreenRequest(BaseModel):
    query: str


class AIAnalysisResponse(OrmBase):
    id: str
    stock_id: Optional[str]
    user_id: str
    query_text: Optional[str]
    analysis_type: str
    response_json: Optional[Dict[str, Any]]
    model_used: Optional[str]
    tokens_used: Optional[int]
    data_timestamp: Optional[datetime]
    confidence: Optional[str]
    created_at: datetime


# ─────────────────────────────────────────────────────────────────────────────
# Backtesting
# ─────────────────────────────────────────────────────────────────────────────
class BacktestRequest(BaseModel):
    """Backtest run configuration."""

    name: str
    description: Optional[str] = None
    universe: List[str] = Field(..., min_length=1)  # list of tickers
    entry_rules: Dict[str, Any] = {}
    exit_rules: Dict[str, Any] = {}
    start_date: date
    end_date: date
    initial_capital: float = Field(100_000.0, gt=0)
    holding_period_days: int = 30
    rebalance_freq: str = "monthly"
    stop_loss_pct: Optional[float] = None
    take_profit_pct: Optional[float] = None
    transaction_cost_pct: float = 0.1
    save_strategy: bool = False


class BacktestResultResponse(OrmBase):
    id: str
    strategy_id: str
    run_at: datetime
    start_date: date
    end_date: date
    initial_capital: float
    final_capital: Optional[float]
    total_return_pct: Optional[float]
    cagr_pct: Optional[float]
    max_drawdown_pct: Optional[float]
    sharpe_ratio: Optional[float]
    win_rate_pct: Optional[float]
    num_trades: Optional[int]
    transaction_cost_pct: Optional[float]
    result_data: Optional[Dict[str, Any]]
    is_demo_data: bool
    backtest_disclaimer: str = (
        "Past backtest results do not guarantee future performance."
    )


# ─────────────────────────────────────────────────────────────────────────────
# Market overview
# ─────────────────────────────────────────────────────────────────────────────
class MarketIndex(BaseModel):
    name: str
    value: float
    change: float
    change_pct: float


class TopMover(BaseModel):
    ticker: str
    name: str
    price: float
    change: float
    change_pct: float
    volume: Optional[float]


class MarketOverview(BaseModel):
    indices: List[MarketIndex]
    gainers: List[TopMover]
    losers: List[TopMover]
    most_active: List[TopMover]
    is_demo_data: bool = False
    retrieved_at: str


# ─────────────────────────────────────────────────────────────────────────────
# Admin
# ─────────────────────────────────────────────────────────────────────────────
class SystemStatus(BaseModel):
    status: str
    version: str
    data_provider_mode: str
    ai_provider: str
    database: str
    redis: str
    total_stocks: int
    total_users: int
    is_demo_mode: bool


class AdminUserResponse(OrmBase):
    id: str
    email: str
    full_name: Optional[str]
    is_active: bool
    is_admin: bool
    subscription_tier: str
    created_at: datetime
