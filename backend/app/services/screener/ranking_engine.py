"""
Pre-built Strategies & Ranking Engine
====================================
Contains predefined strategy templates and stock ranking logic.
"""

PRE_BUILT_STRATEGIES = {
    "quality_compounders": {
        "slug": "quality_compounders",
        "name": "Quality Compounders",
        "description": "High ROIC, high margins, low debt, strong FCF, consistent growth",
        "filters": [
            {"field": "roic", "operator": ">", "value": 15},
            {"field": "gross_margin", "operator": ">", "value": 30},
            {"field": "debt_to_equity", "operator": "<", "value": 0.5},
            {"field": "revenue_growth", "operator": ">", "value": 8},
        ],
        "rank_by": "roic",
        "rank_direction": "desc"
    },
    "undervalued_quality": {
        "slug": "undervalued_quality",
        "name": "Undervalued Quality",
        "description": "High quality fundamentals trading at a reasonable valuation or fair value discount",
        "filters": [
            {"field": "roic", "operator": ">", "value": 12},
            {"field": "pe_ratio", "operator": "<", "value": 25},
            {"field": "debt_to_equity", "operator": "<", "value": 0.8},
        ],
        "rank_by": "overall_score",
        "rank_direction": "desc"
    },
    "dividend_quality": {
        "slug": "dividend_quality",
        "name": "Dividend Quality",
        "description": "High dividend yield with strong FCF coverage and financial health",
        "filters": [
            {"field": "dividend_yield", "operator": ">", "value": 1.5},
            {"field": "fcf_yield", "operator": ">", "value": 3.0},
            {"field": "piotroski_score", "operator": ">=", "value": 6},
        ],
        "rank_by": "dividend_yield",
        "rank_direction": "desc"
    },
    "high_growth": {
        "slug": "high_growth",
        "name": "High Growth",
        "description": "High revenue growth and EPS growth with solid market opportunity",
        "filters": [
            {"field": "revenue_growth", "operator": ">", "value": 15},
            {"field": "eps_growth", "operator": ">", "value": 15},
        ],
        "rank_by": "revenue_growth",
        "rank_direction": "desc"
    },
    "turnaround": {
        "slug": "turnaround",
        "name": "Turnaround Candidates",
        "description": "Improving earnings, margin expansion, and balance sheet strengthening",
        "filters": [
            {"field": "piotroski_score", "operator": ">=", "value": 6},
            {"field": "revenue_growth", "operator": ">", "value": 5},
        ],
        "rank_by": "piotroski_score",
        "rank_direction": "desc"
    },
    "deep_value": {
        "slug": "deep_value",
        "name": "Deep Value",
        "description": "Low P/E and low P/B with positive cash flow and healthy balance sheet",
        "filters": [
            {"field": "pe_ratio", "operator": "<", "value": 15},
            {"field": "pb_ratio", "operator": "<", "value": 3},
            {"field": "fcf_yield", "operator": ">", "value": 4.0},
        ],
        "rank_by": "pe_ratio",
        "rank_direction": "asc"
    },
    "momentum": {
        "slug": "momentum",
        "name": "Momentum Leaders",
        "description": "Strong price trend and technical score with solid fundamentals",
        "filters": [
            {"field": "overall_score", "operator": ">=", "value": 70},
        ],
        "rank_by": "overall_score",
        "rank_direction": "desc"
    }
}
