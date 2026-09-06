"""
Abstract base classes for all data providers.
Implement these interfaces to add new data sources.
The application depends only on these interfaces — never on concrete implementations.
This ensures you can swap providers without changing business logic.
"""

from abc import ABC, abstractmethod
from datetime import date, datetime
from typing import Optional, List, Dict, Any


class DataQualityMixin:
    """
    Mixin that every provider response dict should include.
    Ensures consistent metadata tracking across all providers.
    """

    @staticmethod
    def make_metadata(
        source: str,
        is_demo: bool = False,
        freshness: str = "DAILY",
        currency: str = None,
        period: str = None,
    ) -> dict:
        return {
            "source": source,
            "is_demo_data": is_demo,
            "data_freshness": freshness,  # REAL_TIME | DELAYED | DAILY | QUARTERLY | ANNUAL | DEMO
            "retrieved_at": datetime.utcnow().isoformat(),
            "currency": currency,
            "period": period,
        }


class MarketDataProvider(ABC, DataQualityMixin):
    """
    Provides real-time/delayed market prices and stock metadata.
    Implementations: MockMarketProvider, YahooFinanceProvider, AlphaVantageProvider, FMPProvider
    """

    @abstractmethod
    async def get_stock_info(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Get stock metadata: name, exchange, sector, industry, market cap, etc.
        Returns None if ticker not found.
        Every response dict must include DataQualityMixin metadata fields.
        """
        ...

    @abstractmethod
    async def search_stocks(self, query: str, exchange: str = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search stocks by name, ticker, or ISIN.
        Returns list of matches with: ticker, name, exchange, currency, current_price, change_pct, market_cap, sector.
        """
        ...

    @abstractmethod
    async def get_price(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Get current price snapshot.
        Returns: {ticker, price, open, high, low, close, volume, change, change_pct,
                  market_cap, week_52_high, week_52_low, data_freshness, updated_at, ...metadata}
        Returns None if unavailable.
        """
        ...

    @abstractmethod
    async def get_price_history(
        self,
        ticker: str,
        start: date,
        end: date,
        interval: str = "1d",
    ) -> List[Dict[str, Any]]:
        """
        Get OHLCV price history.
        interval: 1m, 5m, 15m, 1h, 4h, 1d, 1wk, 1mo
        Returns list of: {time (unix), open, high, low, close, volume, adjusted_close}
        Returns empty list if unavailable — never raises.
        """
        ...

    @abstractmethod
    async def get_market_overview(self) -> Dict[str, Any]:
        """
        Get major market indices, global snapshot.
        Returns: {indices: [...], updated_at, ...metadata}
        """
        ...

    @abstractmethod
    async def get_top_movers(self, market: str = "NSE", limit: int = 10) -> Dict[str, Any]:
        """
        Get top gainers and losers for a market.
        Returns: {gainers: [...], losers: [...], most_active: [...], ...metadata}
        """
        ...

    @abstractmethod
    async def get_market_breadth(self, market: str = "NSE") -> Dict[str, Any]:
        """
        Get advance/decline data and breadth indicators.
        Returns: {advancing, declining, unchanged, new_highs, new_lows, ...metadata}
        """
        ...


class FundamentalDataProvider(ABC, DataQualityMixin):
    """
    Provides company financial statements and key metrics.
    Implementations: MockFundamentalProvider, FMPProvider, YahooFundamentalsProvider
    """

    @abstractmethod
    async def get_income_statement(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get income statements (annual or quarterly).
        Returns list ordered newest-first with all line items:
        revenue, gross_profit, operating_income, ebitda, net_income, eps_diluted, shares_diluted, ...
        """
        ...

    @abstractmethod
    async def get_balance_sheet(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get balance sheets.
        Returns: cash, short_term_investments, accounts_receivable, total_assets,
                 current_liabilities, long_term_debt, shareholders_equity, retained_earnings, ...
        """
        ...

    @abstractmethod
    async def get_cash_flow_statement(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get cash flow statements.
        Returns: operating_cash_flow, capital_expenditures, free_cash_flow,
                 investing_cash_flow, financing_cash_flow, dividends_paid, ...
        """
        ...

    @abstractmethod
    async def get_key_metrics(
        self, ticker: str, period: str = "annual", limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get pre-computed key metrics: PE, PB, ROE, ROIC, etc.
        Use these when available to supplement or validate own calculations.
        """
        ...

    @abstractmethod
    async def get_peers(self, ticker: str) -> List[str]:
        """
        Get list of peer/comparable company tickers.
        Returns list of ticker strings.
        """
        ...

    @abstractmethod
    async def get_company_profile(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Get company profile: description, employees, founded, CEO, address, website.
        """
        ...


class NewsProvider(ABC, DataQualityMixin):
    """
    Provides company and market news with optional sentiment.
    Implementations: MockNewsProvider, NewsAPIProvider, GNewsProvider
    """

    @abstractmethod
    async def get_stock_news(self, ticker: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get news for a specific stock.
        Returns list of: {headline, summary, url, source_name, published_at, category, topics, ...metadata}
        NEVER fabricate news URLs or content.
        """
        ...

    @abstractmethod
    async def get_market_news(self, category: str = "general", limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get general market news.
        category: general | earnings | ipo | merger | economy | technology | energy
        """
        ...


class EconomicDataProvider(ABC, DataQualityMixin):
    """
    Provides macroeconomic calendar events and indicator data.
    Implementations: MockEconomicProvider, FREDProvider
    """

    @abstractmethod
    async def get_economic_calendar(
        self,
        start: date,
        end: date,
        country: Optional[str] = None,
        impact: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Get upcoming and past economic events.
        Returns: {name, country, category, event_date, previous_value, forecast_value, actual_value, unit, impact_level}
        """
        ...

    @abstractmethod
    async def get_indicator(self, indicator: str, limit: int = 24) -> List[Dict[str, Any]]:
        """
        Get historical values for a specific economic indicator.
        indicator examples: 'CPI', 'GDP', 'UNEMPLOYMENT', 'INTEREST_RATE', 'PMI'
        Returns list of: {date, value, unit, ...metadata}
        """
        ...


class EarningsProvider(ABC, DataQualityMixin):
    """
    Provides earnings history and upcoming earnings calendar.
    Implementations: MockEarningsProvider, FMPEarningsProvider
    """

    @abstractmethod
    async def get_earnings_history(self, ticker: str, limit: int = 8) -> List[Dict[str, Any]]:
        """
        Get historical earnings results.
        Returns: {earnings_date, period, fiscal_year, fiscal_quarter,
                  eps_actual, eps_estimate, eps_surprise_pct,
                  revenue_actual, revenue_estimate, revenue_surprise_pct, result}
        """
        ...

    @abstractmethod
    async def get_earnings_calendar(self, start: date, end: date) -> List[Dict[str, Any]]:
        """
        Get upcoming earnings dates for all tracked stocks.
        """
        ...


class DividendProvider(ABC, DataQualityMixin):
    """
    Provides dividend history and upcoming dividend events.
    Implementations: MockDividendProvider, FMPDividendProvider, YahooDividendProvider
    """

    @abstractmethod
    async def get_dividend_history(self, ticker: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get historical dividends.
        Returns: {ex_date, pay_date, amount, frequency, dividend_yield, payout_ratio, fcf_coverage}
        """
        ...

    @abstractmethod
    async def get_dividend_calendar(self, start: date, end: date) -> List[Dict[str, Any]]:
        """
        Get upcoming ex-dividend dates for all tracked stocks.
        """
        ...


class AnalystDataProvider(ABC, DataQualityMixin):
    """
    Provides analyst ratings, price targets, and consensus estimates.
    Implementations: MockAnalystProvider, FMPAnalystProvider
    """

    @abstractmethod
    async def get_analyst_estimates(self, ticker: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent analyst ratings and price targets.
        Returns: {analyst_name, firm_name, rating, target_price, previous_target, date}
        """
        ...

    @abstractmethod
    async def get_price_targets(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Get consensus price target summary.
        Returns: {consensus_rating, consensus_target, high_target, low_target, num_analysts}
        """
        ...

    @abstractmethod
    async def get_consensus_estimates(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Get consensus EPS/revenue estimates for upcoming quarters.
        """
        ...


class ProviderRegistry:
    """
    Central registry that returns the appropriate provider based on settings.
    This is the only place where concrete providers are instantiated.
    """

    _market: Optional[MarketDataProvider] = None
    _fundamental: Optional[FundamentalDataProvider] = None
    _news: Optional[NewsProvider] = None
    _economic: Optional[EconomicDataProvider] = None
    _earnings: Optional[EarningsProvider] = None
    _dividend: Optional[DividendProvider] = None
    _analyst: Optional[AnalystDataProvider] = None

    @classmethod
    def initialize(cls, settings) -> None:
        """Initialize all providers based on settings. Call once on app startup."""
        from app.providers.mock.mock_provider import (
            MockMarketDataProvider,
            MockFundamentalDataProvider,
            MockNewsProvider,
            MockEconomicDataProvider,
            MockEarningsProvider,
            MockDividendProvider,
            MockAnalystDataProvider,
        )

        if settings.DATA_PROVIDER_MODE == "mock":
            cls._market = MockMarketDataProvider()
            cls._fundamental = MockFundamentalDataProvider()
            cls._news = MockNewsProvider()
            cls._economic = MockEconomicDataProvider()
            cls._earnings = MockEarningsProvider()
            cls._dividend = MockDividendProvider()
            cls._analyst = MockAnalystDataProvider()
        else:
            # Live mode: use configured providers with fallback to mock
            cls._market = cls._create_market_provider(settings)
            cls._fundamental = cls._create_fundamental_provider(settings)
            cls._news = cls._create_news_provider(settings)
            cls._economic = cls._create_economic_provider(settings)
            cls._earnings = cls._create_earnings_provider(settings)
            cls._dividend = cls._create_dividend_provider(settings)
            cls._analyst = cls._create_analyst_provider(settings)

    @classmethod
    def _create_market_provider(cls, settings) -> MarketDataProvider:
        from app.providers.angel_one.smartapi_provider import AngelOneMarketDataProvider
        from app.providers.yahoo_finance.yf_provider import YFinanceMarketDataProvider
        from app.providers.alpha_vantage.av_provider import AlphaVantageProvider
        from app.providers.mock.mock_provider import MockMarketDataProvider

        provider_map = {
            "angel_one": lambda: AngelOneMarketDataProvider(api_key=getattr(settings, "ANGELONE_API_KEY", "kHrodFlM")),
            "alpha_vantage": lambda: AlphaVantageProvider(),
            "yahoo_finance": lambda: YFinanceMarketDataProvider(),
            "mock": lambda: MockMarketDataProvider(),
        }
        factory = provider_map.get(settings.MARKET_DATA_PROVIDER, provider_map["angel_one"])
        return factory()

    @classmethod
    def _create_fundamental_provider(cls, settings) -> FundamentalDataProvider:
        from app.providers.mock.mock_provider import MockFundamentalDataProvider
        return MockFundamentalDataProvider()

    @classmethod
    def _create_news_provider(cls, settings) -> NewsProvider:
        from app.providers.news_api.news_provider import NewsAPIProvider
        from app.providers.mock.mock_provider import MockNewsProvider
        return NewsAPIProvider()

    @classmethod
    def _create_economic_provider(cls, settings) -> EconomicDataProvider:
        from app.providers.mock.mock_provider import MockEconomicDataProvider
        return MockEconomicDataProvider()

    @classmethod
    def _create_earnings_provider(cls, settings) -> EarningsProvider:
        from app.providers.mock.mock_provider import MockEarningsProvider
        return MockEarningsProvider()

    @classmethod
    def _create_dividend_provider(cls, settings) -> DividendProvider:
        from app.providers.mock.mock_provider import MockDividendProvider
        return MockDividendProvider()

    @classmethod
    def _create_analyst_provider(cls, settings) -> AnalystDataProvider:
        from app.providers.mock.mock_provider import MockAnalystDataProvider
        return MockAnalystDataProvider()

    @classmethod
    def market(cls) -> MarketDataProvider:
        if cls._market is None:
            from app.providers.angel_one.smartapi_provider import AngelOneMarketDataProvider
            cls._market = AngelOneMarketDataProvider()
        return cls._market

    @classmethod
    def fundamental(cls) -> FundamentalDataProvider:
        if cls._fundamental is None:
            from app.providers.mock.mock_provider import MockFundamentalDataProvider
            cls._fundamental = MockFundamentalDataProvider()
        return cls._fundamental

    @classmethod
    def news(cls) -> NewsProvider:
        if cls._news is None:
            from app.providers.mock.mock_provider import MockNewsProvider
            cls._news = MockNewsProvider()
        return cls._news

    @classmethod
    def economic(cls) -> EconomicDataProvider:
        if cls._economic is None:
            from app.providers.mock.mock_provider import MockEconomicDataProvider
            cls._economic = MockEconomicDataProvider()
        return cls._economic

    @classmethod
    def earnings(cls) -> EarningsProvider:
        if cls._earnings is None:
            from app.providers.mock.mock_provider import MockEarningsProvider
            cls._earnings = MockEarningsProvider()
        return cls._earnings

    @classmethod
    def dividend(cls) -> DividendProvider:
        if cls._dividend is None:
            from app.providers.mock.mock_provider import MockDividendProvider
            cls._dividend = MockDividendProvider()
        return cls._dividend

    @classmethod
    def analyst(cls) -> AnalystDataProvider:
        if cls._analyst is None:
            from app.providers.mock.mock_provider import MockAnalystDataProvider
            cls._analyst = MockAnalystDataProvider()
        return cls._analyst
