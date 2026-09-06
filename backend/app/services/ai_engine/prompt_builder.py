"""
AI Prompt Builder Module
========================
Builds structured prompts injecting retrieved data and forcing strict evidence-based output.
"""

from typing import Dict, Any, List

class PromptBuilder:
    @staticmethod
    def build_stock_analysis_prompt(ticker: str, data: Dict[str, Any]) -> str:
        return f"""
You are an expert quantitative analyst and financial researcher.
Analyze the following stock strictly using the retrieve data provided below.
DO NOT fabricate numbers, facts, news, or target prices.

DATA CONTEXT FOR {ticker}:
{data}

INSTRUCTIONS:
1. Provide a rigorous, objective research verdict.
2. Structure your analysis into clear markdown sections:
   - Verdict & Score
   - Business & Quality Analysis
   - Financial Fundamentals & Growth
   - Financial Health & Solvency
   - Valuation & Scenarios (Bull / Base / Bear)
   - Technical & Momentum Picture
   - Key Catalysts & Risks
   - Data Timestamp & Sources
3. Clearly distinguish FACTUAL DATA, CALCULATED METRICS, ESTIMATES, and FORECAST.
4. Emphasize that predictions are scenario-based and NOT guaranteed.
"""

    @staticmethod
    def build_comparison_prompt(tickers: List[str], data_map: Dict[str, Any]) -> str:
        return f"""
Compare the following stocks side-by-side: {', '.join(tickers)}.
Use the retrieved data context below:
{data_map}

Structure the comparison:
1. Executive Summary & Winner
2. Growth & Profitability Comparison
3. Valuation & Fair Value Comparison
4. Financial Health & Risk Comparison
5. Key Takeaways
"""
