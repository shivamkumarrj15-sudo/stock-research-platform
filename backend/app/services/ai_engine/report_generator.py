"""
AI Report Generator Service
===========================
Generates downloadable, comprehensive PDF/JSON research reports.
"""

from typing import Dict, Any

class ReportGenerator:
    @staticmethod
    def generate_full_report(ticker: str, data: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "title": f"Institutional Stock Research Report — {ticker}",
            "ticker": ticker,
            "company_name": data.get("name", ticker),
            "generated_at": analysis.get("data_timestamp"),
            "research_score": data.get("overall_score", 80),
            "summary_verdict": analysis.get("verdict"),
            "sections": {
                "business_quality": analysis.get("business_quality"),
                "fundamentals": analysis.get("fundamentals"),
                "financial_health": analysis.get("financial_health"),
                "valuation": analysis.get("valuation"),
                "technical_picture": analysis.get("technical_picture"),
                "scenarios": {
                    "bull": analysis.get("bull_case"),
                    "base": analysis.get("base_case"),
                    "bear": analysis.get("bear_case"),
                },
                "risks": analysis.get("risks"),
                "invalidation_criteria": analysis.get("invalidation_points")
            },
            "sources": analysis.get("sources", []),
            "disclaimer": analysis.get("disclaimer")
        }
