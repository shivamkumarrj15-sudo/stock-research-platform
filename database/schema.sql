-- ============================================================
-- AI STOCK RESEARCH PLATFORM — POSTGRESQL DATABASE SCHEMA
-- ============================================================
-- Run via: psql -U stockuser -d stockresearch -f schema.sql
-- Or let Alembic migrations handle this (preferred in production)
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search

-- ============================================================
-- USERS & AUTH
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    is_active       BOOLEAN DEFAULT TRUE,
    is_admin        BOOLEAN DEFAULT FALSE,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'pro_plus')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- EXCHANGES & STOCKS
-- ============================================================

CREATE TABLE IF NOT EXISTS exchanges (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    short_name  VARCHAR(20) NOT NULL,
    country     VARCHAR(50) NOT NULL,
    currency    VARCHAR(10) NOT NULL,
    mic_code    VARCHAR(10),
    timezone    VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO exchanges (name, short_name, country, currency, mic_code, timezone) VALUES
    ('National Stock Exchange', 'NSE', 'India', 'INR', 'XNSE', 'Asia/Kolkata'),
    ('Bombay Stock Exchange', 'BSE', 'India', 'INR', 'XBOM', 'Asia/Kolkata'),
    ('New York Stock Exchange', 'NYSE', 'US', 'USD', 'XNYS', 'America/New_York'),
    ('NASDAQ', 'NASDAQ', 'US', 'USD', 'XNAS', 'America/New_York'),
    ('London Stock Exchange', 'LSE', 'UK', 'GBP', 'XLON', 'Europe/London'),
    ('Tokyo Stock Exchange', 'TSE', 'Japan', 'JPY', 'XTKS', 'Asia/Tokyo')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS stocks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker          VARCHAR(20) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    exchange_id     UUID REFERENCES exchanges(id) ON DELETE SET NULL,
    sector          VARCHAR(100),
    industry        VARCHAR(150),
    country         VARCHAR(50),
    currency        VARCHAR(10) DEFAULT 'INR',
    isin            VARCHAR(20),
    description     TEXT,
    website         VARCHAR(255),
    employees       INTEGER,
    founded_year    INTEGER,
    is_active       BOOLEAN DEFAULT TRUE,
    is_demo_data    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ticker, exchange_id)
);

CREATE INDEX IF NOT EXISTS idx_stocks_ticker ON stocks(ticker);
CREATE INDEX IF NOT EXISTS idx_stocks_name_trgm ON stocks USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_stocks_exchange ON stocks(exchange_id);
CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector);

-- ============================================================
-- PRICE DATA
-- ============================================================

CREATE TABLE IF NOT EXISTS prices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id        UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    open            NUMERIC(18, 4),
    high            NUMERIC(18, 4),
    low             NUMERIC(18, 4),
    close           NUMERIC(18, 4),
    volume          BIGINT,
    adjusted_close  NUMERIC(18, 4),
    source          VARCHAR(100),
    data_freshness  VARCHAR(20) DEFAULT 'DAILY' CHECK (data_freshness IN ('REAL_TIME', 'DELAYED', 'DAILY', 'DEMO')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(stock_id, date)
);

CREATE INDEX IF NOT EXISTS idx_prices_stock_date ON prices(stock_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_prices_date ON prices(date DESC);

-- ============================================================
-- FINANCIAL STATEMENTS (Income, Balance Sheet, Cash Flow)
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_statements (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id        UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    period          VARCHAR(20) DEFAULT 'annual' CHECK (period IN ('annual', 'quarterly', 'ttm')),
    fiscal_year     INTEGER,
    fiscal_quarter  INTEGER CHECK (fiscal_quarter IN (1, 2, 3, 4, NULL)),
    statement_type  VARCHAR(20) CHECK (statement_type IN ('income', 'balance', 'cashflow')),
    -- Income statement fields
    revenue                     NUMERIC(20, 2),
    cost_of_revenue             NUMERIC(20, 2),
    gross_profit                NUMERIC(20, 2),
    operating_expenses          NUMERIC(20, 2),
    operating_income            NUMERIC(20, 2),
    ebitda                      NUMERIC(20, 2),
    depreciation_amortization   NUMERIC(20, 2),
    interest_expense            NUMERIC(20, 2),
    net_income                  NUMERIC(20, 2),
    eps_basic                   NUMERIC(10, 4),
    eps_diluted                 NUMERIC(10, 4),
    shares_outstanding          BIGINT,
    shares_diluted              BIGINT,
    -- Balance sheet fields
    cash                        NUMERIC(20, 2),
    short_term_investments      NUMERIC(20, 2),
    accounts_receivable         NUMERIC(20, 2),
    inventory                   NUMERIC(20, 2),
    current_assets              NUMERIC(20, 2),
    total_assets                NUMERIC(20, 2),
    accounts_payable            NUMERIC(20, 2),
    short_term_debt             NUMERIC(20, 2),
    current_liabilities         NUMERIC(20, 2),
    long_term_debt              NUMERIC(20, 2),
    total_liabilities           NUMERIC(20, 2),
    shareholders_equity         NUMERIC(20, 2),
    retained_earnings           NUMERIC(20, 2),
    -- Cash flow fields
    operating_cash_flow         NUMERIC(20, 2),
    capital_expenditures        NUMERIC(20, 2),
    free_cash_flow              NUMERIC(20, 2),
    investing_cash_flow         NUMERIC(20, 2),
    financing_cash_flow         NUMERIC(20, 2),
    dividends_paid              NUMERIC(20, 2),
    net_change_in_cash          NUMERIC(20, 2),
    -- Metadata
    currency        VARCHAR(10) DEFAULT 'INR',
    source          VARCHAR(100),
    retrieved_at    TIMESTAMPTZ DEFAULT NOW(),
    is_demo_data    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(stock_id, period, fiscal_year, fiscal_quarter, statement_type)
);

CREATE INDEX IF NOT EXISTS idx_financials_stock ON financial_statements(stock_id, period, fiscal_year DESC);

-- ============================================================
-- FINANCIAL RATIOS (computed & stored)
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_ratios (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id            UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    period              VARCHAR(20) DEFAULT 'annual',
    fiscal_year         INTEGER,
    fiscal_quarter      INTEGER,
    -- Profitability
    roe                 NUMERIC(10, 4),
    roa                 NUMERIC(10, 4),
    roic                NUMERIC(10, 4),
    gross_margin        NUMERIC(10, 4),
    operating_margin    NUMERIC(10, 4),
    ebitda_margin       NUMERIC(10, 4),
    net_margin          NUMERIC(10, 4),
    -- Liquidity
    current_ratio       NUMERIC(10, 4),
    quick_ratio         NUMERIC(10, 4),
    -- Leverage
    debt_to_equity      NUMERIC(10, 4),
    net_debt_to_ebitda  NUMERIC(10, 4),
    interest_coverage   NUMERIC(10, 4),
    -- Efficiency
    asset_turnover      NUMERIC(10, 4),
    inventory_turnover  NUMERIC(10, 4),
    -- Growth
    revenue_growth_yoy  NUMERIC(10, 4),
    eps_growth_yoy      NUMERIC(10, 4),
    fcf_growth_yoy      NUMERIC(10, 4),
    revenue_cagr_3y     NUMERIC(10, 4),
    revenue_cagr_5y     NUMERIC(10, 4),
    eps_cagr_3y         NUMERIC(10, 4),
    -- Valuation
    pe_ratio            NUMERIC(10, 4),
    forward_pe          NUMERIC(10, 4),
    pb_ratio            NUMERIC(10, 4),
    ps_ratio            NUMERIC(10, 4),
    ev_ebitda           NUMERIC(10, 4),
    ev_revenue          NUMERIC(10, 4),
    peg_ratio           NUMERIC(10, 4),
    fcf_yield           NUMERIC(10, 4),
    dividend_yield      NUMERIC(10, 4),
    -- Cash flow
    fcf                 NUMERIC(20, 2),
    fcf_margin          NUMERIC(10, 4),
    capex_to_revenue    NUMERIC(10, 4),
    -- Metadata
    source              VARCHAR(100),
    retrieved_at        TIMESTAMPTZ DEFAULT NOW(),
    is_demo_data        BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(stock_id, period, fiscal_year, fiscal_quarter)
);

CREATE INDEX IF NOT EXISTS idx_ratios_stock ON financial_ratios(stock_id, period, fiscal_year DESC);
CREATE INDEX IF NOT EXISTS idx_ratios_roic ON financial_ratios(roic DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_ratios_pe ON financial_ratios(pe_ratio ASC NULLS LAST);

-- ============================================================
-- STOCK SCORES
-- ============================================================

CREATE TABLE IF NOT EXISTS stock_scores (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id                UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    scored_at               TIMESTAMPTZ DEFAULT NOW(),
    overall_score           NUMERIC(5, 2),
    fundamental_score       NUMERIC(5, 2),
    valuation_score         NUMERIC(5, 2),
    growth_score            NUMERIC(5, 2),
    health_score            NUMERIC(5, 2),
    technical_score         NUMERIC(5, 2),
    momentum_score          NUMERIC(5, 2),
    dividend_score          NUMERIC(5, 2),
    risk_score              NUMERIC(5, 2),
    quality_score           NUMERIC(5, 2),
    analyst_score           NUMERIC(5, 2),
    piotroski_score         NUMERIC(3, 0),       -- 0-9
    beneish_mscore          NUMERIC(10, 4),       -- typically -2 to 0
    altman_zscore           NUMERIC(10, 4),
    score_weights           JSONB,
    calculation_details     JSONB,
    data_completeness_pct   NUMERIC(5, 2),
    confidence              VARCHAR(10) DEFAULT 'medium' CHECK (confidence IN ('low', 'medium', 'high')),
    is_demo_data            BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scores_stock ON stock_scores(stock_id, scored_at DESC);
CREATE INDEX IF NOT EXISTS idx_scores_overall ON stock_scores(overall_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_scores_health ON stock_scores(health_score DESC NULLS LAST);

-- ============================================================
-- FAIR VALUE
-- ============================================================

CREATE TABLE IF NOT EXISTS fair_values (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id        UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    method          VARCHAR(50) CHECK (method IN ('dcf', 'relative', 'fcf', 'ddm', 'historical', 'composite', 'ev_ebitda')),
    current_price   NUMERIC(18, 4),
    fair_value_low  NUMERIC(18, 4),
    fair_value_base NUMERIC(18, 4),
    fair_value_high NUMERIC(18, 4),
    upside_pct      NUMERIC(10, 4),
    assumptions     JSONB,
    calculated_at   TIMESTAMPTZ DEFAULT NOW(),
    is_demo_data    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fv_stock ON fair_values(stock_id, calculated_at DESC);

-- ============================================================
-- EARNINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS earnings (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id                UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    earnings_date           DATE,
    period                  VARCHAR(20),
    fiscal_year             INTEGER,
    fiscal_quarter          INTEGER,
    eps_actual              NUMERIC(10, 4),
    eps_estimate            NUMERIC(10, 4),
    eps_surprise_pct        NUMERIC(10, 4),
    revenue_actual          NUMERIC(20, 2),
    revenue_estimate        NUMERIC(20, 2),
    revenue_surprise_pct    NUMERIC(10, 4),
    guidance_text           TEXT,
    analyst_revisions       JSONB,
    result                  VARCHAR(20) CHECK (result IN ('beat', 'miss', 'inline', 'upcoming', 'unknown')),
    source                  VARCHAR(100),
    is_demo_data            BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(stock_id, fiscal_year, fiscal_quarter)
);

CREATE INDEX IF NOT EXISTS idx_earnings_stock ON earnings(stock_id, earnings_date DESC);
CREATE INDEX IF NOT EXISTS idx_earnings_date ON earnings(earnings_date);

-- ============================================================
-- DIVIDENDS
-- ============================================================

CREATE TABLE IF NOT EXISTS dividends (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id        UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    ex_date         DATE,
    pay_date        DATE,
    amount          NUMERIC(10, 4),
    frequency       VARCHAR(20),
    dividend_yield  NUMERIC(10, 4),
    payout_ratio    NUMERIC(10, 4),
    fcf_coverage    NUMERIC(10, 4),
    source          VARCHAR(100),
    is_demo_data    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dividends_stock ON dividends(stock_id, ex_date DESC);
CREATE INDEX IF NOT EXISTS idx_dividends_ex_date ON dividends(ex_date);

-- ============================================================
-- NEWS
-- ============================================================

CREATE TABLE IF NOT EXISTS news_articles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id        UUID REFERENCES stocks(id) ON DELETE SET NULL,
    headline        VARCHAR(500) NOT NULL,
    summary         TEXT,
    url             TEXT,
    source_name     VARCHAR(100),
    published_at    TIMESTAMPTZ,
    sentiment_score NUMERIC(5, 2),       -- -100 to +100
    sentiment_label VARCHAR(20) CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
    category        VARCHAR(50),
    topics          JSONB,
    is_demo_data    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_stock ON news_articles(stock_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_sentiment ON news_articles(sentiment_label);

-- ============================================================
-- ECONOMIC EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS economic_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    country         VARCHAR(50),
    category        VARCHAR(100),
    event_date      TIMESTAMPTZ,
    previous_value  NUMERIC(18, 4),
    forecast_value  NUMERIC(18, 4),
    actual_value    NUMERIC(18, 4),
    unit            VARCHAR(50),
    impact_level    VARCHAR(10) DEFAULT 'medium' CHECK (impact_level IN ('low', 'medium', 'high')),
    source          VARCHAR(100),
    is_demo_data    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_economic_date ON economic_events(event_date);
CREATE INDEX IF NOT EXISTS idx_economic_country ON economic_events(country);
CREATE INDEX IF NOT EXISTS idx_economic_impact ON economic_events(impact_level);

-- ============================================================
-- ANALYST ESTIMATES
-- ============================================================

CREATE TABLE IF NOT EXISTS analyst_estimates (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id            UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    analyst_name        VARCHAR(200),
    firm_name           VARCHAR(200),
    rating              VARCHAR(50),
    target_price        NUMERIC(18, 4),
    previous_target     NUMERIC(18, 4),
    date                DATE,
    consensus_rating    VARCHAR(50),
    consensus_target    NUMERIC(18, 4),
    source              VARCHAR(100),
    is_demo_data        BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analyst_stock ON analyst_estimates(stock_id, date DESC);

-- ============================================================
-- WATCHLISTS
-- ============================================================

CREATE TABLE IF NOT EXISTS watchlists (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS watchlist_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    watchlist_id    UUID NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
    stock_id        UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    added_at        TIMESTAMPTZ DEFAULT NOW(),
    notes           TEXT,
    UNIQUE(watchlist_id, stock_id)
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_items ON watchlist_items(watchlist_id);

-- ============================================================
-- PORTFOLIOS
-- ============================================================

CREATE TABLE IF NOT EXISTS portfolios (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    currency    VARCHAR(10) DEFAULT 'INR',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_positions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id    UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    stock_id        UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    quantity        NUMERIC(18, 4) NOT NULL,
    buy_price       NUMERIC(18, 4) NOT NULL,
    buy_date        DATE,
    notes           TEXT,
    is_closed       BOOLEAN DEFAULT FALSE,
    sell_price      NUMERIC(18, 4),
    sell_date       DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_user ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_portfolio ON portfolio_positions(portfolio_id);

-- ============================================================
-- ALERTS
-- ============================================================

CREATE TABLE IF NOT EXISTS alerts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id            UUID REFERENCES stocks(id) ON DELETE CASCADE,
    alert_type          VARCHAR(50) CHECK (alert_type IN (
                            'price', 'pct_change', 'rsi', '52w_high', '52w_low',
                            'earnings', 'fair_value', 'score', 'technical', 'volume',
                            'dividend', 'economic'
                        )),
    condition           VARCHAR(20) CHECK (condition IN ('above', 'below', 'crosses_above', 'crosses_below')),
    threshold_value     NUMERIC(18, 4),
    is_triggered        BOOLEAN DEFAULT FALSE,
    triggered_at        TIMESTAMPTZ,
    is_active           BOOLEAN DEFAULT TRUE,
    notification_sent   BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active, is_triggered);
CREATE INDEX IF NOT EXISTS idx_alerts_stock ON alerts(stock_id);

-- ============================================================
-- BACKTESTING
-- ============================================================

CREATE TABLE IF NOT EXISTS backtest_strategies (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                VARCHAR(100) NOT NULL,
    description         TEXT,
    universe_filter     JSONB,
    entry_rules         JSONB,
    exit_rules          JSONB,
    holding_period_days INTEGER DEFAULT 30,
    rebalance_freq      VARCHAR(20) DEFAULT 'monthly',
    stop_loss_pct       NUMERIC(5, 2),
    take_profit_pct     NUMERIC(5, 2),
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS backtest_results (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id         UUID REFERENCES backtest_strategies(id) ON DELETE SET NULL,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    run_at              TIMESTAMPTZ DEFAULT NOW(),
    start_date          DATE,
    end_date            DATE,
    initial_capital     NUMERIC(20, 2),
    final_capital       NUMERIC(20, 2),
    total_return_pct    NUMERIC(10, 4),
    cagr_pct            NUMERIC(10, 4),
    max_drawdown_pct    NUMERIC(10, 4),
    sharpe_ratio        NUMERIC(10, 4),
    win_rate_pct        NUMERIC(10, 4),
    num_trades          INTEGER,
    transaction_cost_pct NUMERIC(5, 4) DEFAULT 0.001,
    result_data         JSONB,
    is_demo_data        BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_backtest_user ON backtest_results(user_id, run_at DESC);

-- ============================================================
-- AI ANALYSES (CACHE)
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_analyses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id        UUID REFERENCES stocks(id) ON DELETE SET NULL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    query_text      TEXT,
    analysis_type   VARCHAR(30) CHECK (analysis_type IN ('stock', 'compare', 'report', 'chat', 'screener', 'portfolio')),
    response_json   JSONB,
    model_used      VARCHAR(100),
    tokens_used     INTEGER,
    data_timestamp  TIMESTAMPTZ,
    confidence      VARCHAR(10),
    is_demo_data    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_stock ON ai_analyses(stock_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_user ON ai_analyses(user_id, created_at DESC);

-- ============================================================
-- DATA SOURCES (PROVENANCE TRACKING)
-- ============================================================

CREATE TABLE IF NOT EXISTS data_sources (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type     VARCHAR(50),    -- 'stock', 'price', 'financial', 'news', etc.
    entity_id       UUID,
    metric_name     VARCHAR(100),
    source_name     VARCHAR(100) NOT NULL,
    source_url      TEXT,
    retrieved_at    TIMESTAMPTZ DEFAULT NOW(),
    data_period     VARCHAR(50),    -- 'FY2024', 'Q3FY2024', 'realtime', etc.
    currency        VARCHAR(10),
    unit            VARCHAR(50),
    confidence      VARCHAR(20) DEFAULT 'medium',
    is_primary      BOOLEAN DEFAULT TRUE,
    is_demo_data    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sources_entity ON data_sources(entity_type, entity_id);

-- ============================================================
-- ADMIN LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_logs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type  VARCHAR(100),
    description TEXT,
    details     JSONB,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_date ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_type ON admin_logs(event_type);

-- ============================================================
-- TRIGGER: update updated_at on all relevant tables
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    EXECUTE (
        SELECT string_agg(
            'CREATE TRIGGER trg_update_' || table_name ||
            ' BEFORE UPDATE ON ' || table_name ||
            ' FOR EACH ROW EXECUTE FUNCTION update_updated_at();',
            E'\n'
        )
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
        AND table_name IN (
            'users', 'exchanges', 'stocks', 'watchlists',
            'portfolios', 'portfolio_positions', 'alerts',
            'backtest_strategies'
        )
    );
END $$;

-- ============================================================
-- VIEWS (helpful aggregations)
-- ============================================================

CREATE OR REPLACE VIEW v_stock_summary AS
SELECT
    s.id,
    s.ticker,
    s.name,
    e.short_name as exchange,
    s.sector,
    s.industry,
    s.country,
    s.currency,
    p.close as current_price,
    p.date as price_date,
    r.roic,
    r.roe,
    r.net_margin,
    r.revenue_growth_yoy,
    r.pe_ratio,
    r.ev_ebitda,
    r.debt_to_equity,
    r.fcf_yield,
    r.dividend_yield,
    sc.overall_score,
    sc.piotroski_score,
    sc.altman_zscore,
    sc.confidence,
    fv.fair_value_base,
    fv.upside_pct as fair_value_upside,
    s.is_demo_data
FROM stocks s
LEFT JOIN exchanges e ON s.exchange_id = e.id
LEFT JOIN LATERAL (
    SELECT close, date FROM prices
    WHERE stock_id = s.id
    ORDER BY date DESC LIMIT 1
) p ON TRUE
LEFT JOIN LATERAL (
    SELECT roic, roe, net_margin, revenue_growth_yoy, pe_ratio,
           ev_ebitda, debt_to_equity, fcf_yield, dividend_yield
    FROM financial_ratios
    WHERE stock_id = s.id AND period = 'annual'
    ORDER BY fiscal_year DESC LIMIT 1
) r ON TRUE
LEFT JOIN LATERAL (
    SELECT overall_score, piotroski_score, altman_zscore, confidence
    FROM stock_scores
    WHERE stock_id = s.id
    ORDER BY scored_at DESC LIMIT 1
) sc ON TRUE
LEFT JOIN LATERAL (
    SELECT fair_value_base, upside_pct
    FROM fair_values
    WHERE stock_id = s.id AND method = 'composite'
    ORDER BY calculated_at DESC LIMIT 1
) fv ON TRUE
WHERE s.is_active = TRUE;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE users IS 'Platform users with subscription tier and auth info';
COMMENT ON TABLE stocks IS 'Stock/company master data. is_demo_data=true for mock provider stocks';
COMMENT ON TABLE financial_statements IS 'Raw financial statements: income, balance sheet, cash flow';
COMMENT ON TABLE financial_ratios IS 'Computed financial ratios and growth metrics, stored for performance';
COMMENT ON TABLE stock_scores IS 'Master stock scores (0-100) with component breakdown';
COMMENT ON TABLE fair_values IS 'Fair value estimates by method (DCF, relative, composite)';
COMMENT ON TABLE ai_analyses IS 'Cached AI analysis responses with data provenance';
COMMENT ON TABLE data_sources IS 'Data provenance tracking - source, timestamp, confidence for every metric';
COMMENT ON VIEW v_stock_summary IS 'Aggregated stock summary for screener and list views';
