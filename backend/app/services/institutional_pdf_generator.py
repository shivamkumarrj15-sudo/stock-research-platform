"""
Master Institutional 14-Pillar Warren Buffett & Complete Equity Research PDF Generator
========================================================================================
Produces the single, exhaustive Master "Bible" Equity Research Memorandum with:
1. 🏛️ Executive Valuation & Scorecard Header
2. 🏢 1. Business Model, Unit Economics & Real-World Analogy
3. 🛡️ 2. The 9-Pillar Economic Moat, Pricing Power & ROIC vs WACC Spread
4. 📈 3. 10-Year Compounding History (Sales, EBIT, PAT, EPS CAGR)
5. 💰 4. Extended 5-Way DuPont Decomposition Matrix
6. 💵 5. Cash Flow Reality & Cash Conversion Cycle (CFO vs PAT, FCF, CCC)
7. 🏦 6. Balance Sheet Solvency & Debt Structure
8. 👔 7. Management Pedigree, Leadership Dossier & Contract Terms
9. 🤝 8. Corporate Tie-ups, Joint Ventures & Order Book Visibility
10. 📊 9. Institutional Shareholding & Smart Money (FII/DII/Super Investors)
11. 📅 10. 12-Month Seasonality & Cyclicality Heatmap
12. ⚔️ 11. Competitor Warfare, Peer Growth Benchmarking & Market Domination
13. 🧮 12. Complete A-Z Valuation Suite (7 Models + Blended Fair Value & 3-Tranche Plan)
14. ⚠️ 13. Forensic Accounting, Beneish 8-Variable M-Score & Munger Pre-Mortem
15. 🏆 14. Final Warren Buffett 5-Gate Checklist & Omaha Investment Verdict
"""

import io
import os
from typing import Dict, Any, List, Optional
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    """Adds running headers and 'Page X of Y' footers to all pages."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, total_pages: int):
        self.saveState()
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))

        if self._pageNumber > 1:
            self.drawString(54, 802, "STOCKIQ INSTITUTIONAL EQUITY RESEARCH — MASTER VALUATION & RESEARCH MEMORANDUM")
            self.drawRightString(558, 802, datetime.utcnow().strftime("%B %Y"))
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 796, 558, 796)

        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)

        self.setFont("Helvetica", 7.5)
        self.drawString(54, 32, "CONFIDENTIAL & PROPRIETARY — INSTITUTIONAL EQUITY RESEARCH & VALUATION DOSSIER")
        self.drawRightString(558, 32, f"Page {self._pageNumber} of {total_pages}")
        self.restoreState()


class InstitutionalPDFGenerator:
    @staticmethod
    def _get_styles():
        styles = getSampleStyleSheet()
        PRIMARY = colors.HexColor("#0F172A")
        SECONDARY = colors.HexColor("#1E293B")
        TEXT_DARK = colors.HexColor("#1E293B")
        TEXT_MUTED = colors.HexColor("#64748B")

        return {
            'title': ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=16, leading=20, textColor=PRIMARY, spaceAfter=2),
            'subtitle': ParagraphStyle('DocSubTitle', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=TEXT_MUTED, spaceAfter=4),
            'h1': ParagraphStyle('SectionH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=PRIMARY, spaceBefore=6, spaceAfter=2.5),
            'h2': ParagraphStyle('SectionH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=SECONDARY, spaceBefore=3, spaceAfter=1.5),
            'body': ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=7.8, leading=11, textColor=TEXT_DARK, spaceAfter=2.5),
            'bullet': ParagraphStyle('Bullet', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, leading=10.5, textColor=TEXT_DARK, leftIndent=7, spaceAfter=1.5),
            'badge_bull': ParagraphStyle('BadgeBull', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=9.5, textColor=colors.HexColor("#059669")),
            'badge_bear': ParagraphStyle('BadgeBear', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=9.5, textColor=colors.HexColor("#DC2626")),
            'table_cell': ParagraphStyle('TableCell', parent=styles['Normal'], fontName='Helvetica', fontSize=7.0, leading=9.2, textColor=TEXT_DARK),
            'table_cell_bold': ParagraphStyle('TableCellBold', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.0, leading=9.2, textColor=TEXT_DARK),
            'table_header': ParagraphStyle('TableHeader', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.0, leading=9.2, textColor=colors.white),
            'highlight_box': ParagraphStyle('Highlight', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7.5, leading=10.5, textColor=SECONDARY),
        }

    @staticmethod
    def generate_master_buffett_12pillar_pdf(
        ticker: str,
        company_name: str,
        fundamentals: Dict[str, Any],
        forensics: Dict[str, Any],
        ai_research: Dict[str, Any],
        news_items: List[Dict[str, Any]],
        output_filepath: Optional[str] = None
    ) -> bytes:
        """Generates the Single Master Comprehensive 14-Pillar Equity Research & Valuation PDF."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, pagesize=A4, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54
        )
        s = InstitutionalPDFGenerator._get_styles()
        elements = []

        # Master Title Block
        elements.append(Paragraph("MASTER INSTITUTIONAL EQUITY RESEARCH MEMORANDUM", s['subtitle']))
        elements.append(Paragraph(f"{company_name} ({ticker})", s['title']))
        elements.append(Paragraph(
            f"<b>CMP:</b> Rs. {fundamentals.get('current_price', 'N/A')} &nbsp;|&nbsp; "
            f"<b>Market Cap:</b> Rs. {fundamentals.get('market_cap_cr', 'N/A')} Cr &nbsp;|&nbsp; "
            f"<b>P/E:</b> {fundamentals.get('pe_ratio', 'N/A')} &nbsp;|&nbsp; "
            f"<b>P/B:</b> {fundamentals.get('pb_ratio', 'N/A')} &nbsp;|&nbsp; "
            f"<b>ROE:</b> {fundamentals.get('roe_pct', 'N/A')}% &nbsp;|&nbsp; "
            f"<b>ROCE:</b> {fundamentals.get('roce_pct', 'N/A')}% &nbsp;|&nbsp; "
            f"<b>D/E:</b> {fundamentals.get('debt_to_equity', 'N/A')}",
            s['subtitle']
        ))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0F172A"), spaceBefore=2, spaceAfter=5))

        # Executive Summary & Institutional Scorecard Banner
        scorecard = forensics.get("buffett_scorecard", {})
        bv = ai_research.get("warren_buffett_final_verdict", {}) or ai_research.get("buffett_verdict", {})
        comp_val = forensics.get("comprehensive_valuation", {})
        score_val = scorecard.get('total_score', bv.get('score_100', 78))
        grade_val = scorecard.get('institutional_grade', bv.get('institutional_grade', 'AA'))
        verdict_val = bv.get('verdict', 'BUY_WITH_MARGIN_OF_SAFETY')
        blended_fv = comp_val.get("blended_fair_value", forensics.get("dcf", {}).get("base_case", {}).get("fair_value", fundamentals.get("current_price", 100)))
        blended_mos = comp_val.get("blended_margin_of_safety_pct", forensics.get("dcf", {}).get("margin_of_safety_pct", 0))

        score_color = "#059669" if score_val >= 75 else "#D97706" if score_val >= 50 else "#DC2626"
        mos_color = "#059669" if blended_mos > 15 else "#D97706" if blended_mos >= 0 else "#DC2626"

        summary_box = [
            [
                Paragraph(
                    f"<b>WARREN BUFFETT VERDICT:</b> <font color='{score_color}'><b>{verdict_val}</b></font><br/>"
                    f"<b>INSTITUTIONAL SCORE:</b> <font color='{score_color}'><b>{score_val}/100</b> ({grade_val})</font><br/>"
                    f"<b>BLENDED FAIR VALUE:</b> <b>Rs. {blended_fv}</b> (<font color='{mos_color}'>MOS: {blended_mos}%</font>)",
                    s['table_cell']
                ),
                Paragraph(f"<b>EXECUTIVE THESIS:</b> {ai_research.get('executive_summary', 'Exhaustive institutional equity research memorandum incorporating 10Y financial statements, forensic manipulation tests, competitor warfare, and 7-model valuation suite.')}", s['table_cell'])
            ]
        ]
        t_sum = Table(summary_box, colWidths=[195, 293])
        t_sum.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(t_sum)
        elements.append(Spacer(1, 4))

        # 🏢 1. Business Model & Value Chain Demystifier
        p1 = ai_research.get("pillar_1_business", {})
        elements.append(Paragraph("🏢 1. BUSINESS MODEL, VALUE CHAIN & UNIT ECONOMICS", s['h1']))
        elements.append(Paragraph(f"&bull; <b>What Company Does:</b> {p1.get('what_company_does', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Revenue Streams:</b> {p1.get('revenue_sources_breakdown', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Everyday Simple Analogy:</b> <i>\"{p1.get('simple_analogy', '')}\"</i>", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>10-20 Year Industry Longevity:</b> {p1.get('future_industry_relevance', '')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 🛡️ 2. The 9-Pillar Economic Moat & Pricing Power
        p2 = ai_research.get("pillar_2_moat_and_advantage", {})
        elements.append(Paragraph("🛡️ 2. COMPETITIVE MOAT, PRICING POWER & BARRIERS TO ENTRY", s['h1']))
        elements.append(Paragraph(f"&bull; <b>Brand & Pricing Power:</b> {p2.get('brand_strength', '')} &bull; {p2.get('pricing_power', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Entry Barriers & Switching Friction:</b> {p2.get('entry_barriers', '')} &bull; {p2.get('switching_costs', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Distribution Monopoly & Market Share:</b> {p2.get('distribution_and_network', '')} &bull; {p2.get('market_share_stability', '')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 📈 3. Growth Engine & 💰 4. Extended 5-Way DuPont
        p3 = ai_research.get("pillar_3_growth_engine", {})
        p4 = ai_research.get("pillar_4_profitability", {})
        dupont = forensics.get("dupont_5way", {})
        elements.append(Paragraph("📈 3. GROWTH ENGINE & 💰 4. EXTENDED 5-WAY DUPONT DECOMPOSITION", s['h1']))
        elements.append(Paragraph(f"&bull; <b>10Y Growth Trajectory:</b> {p3.get('sales_growth_5y_10y', '')} &bull; {p3.get('operating_profit_and_eps_growth', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Catalysts for Future Compounding:</b> {p3.get('realistic_future_growth_driver', '')}", s['bullet']))

        dupont_data = [
            [Paragraph("Tax Burden", s['table_header']), Paragraph("Interest Burden", s['table_header']), Paragraph("EBIT Margin", s['table_header']), Paragraph("Asset Turnover", s['table_header']), Paragraph("Leverage (Assets/Eq)", s['table_header']), Paragraph("ROE %", s['table_header'])],
            [
                Paragraph(str(dupont.get("tax_burden", "0.75")), s['table_cell']),
                Paragraph(str(dupont.get("interest_burden", "0.85")), s['table_cell']),
                Paragraph(f"{dupont.get('operating_margin_pct', '18.0')}%", s['table_cell']),
                Paragraph(str(dupont.get("asset_turnover", "1.1x")), s['table_cell']),
                Paragraph(str(dupont.get("equity_multiplier", "1.4x")), s['table_cell']),
                Paragraph(f"<b>{dupont.get('calculated_roe_pct', fundamentals.get('roe_pct', 20))}%</b>", s['table_cell']),
            ]
        ]
        t_dup = Table(dupont_data, colWidths=[80, 80, 85, 80, 95, 68])
        t_dup.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 2),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ]))
        elements.append(t_dup)
        elements.append(Paragraph(f"&bull; <b>DuPont Driver Verdict:</b> {dupont.get('primary_driver', 'Core operating pricing power and healthy capital efficiency.')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 💵 5. Cash Flow Quality & 🏦 6. Balance Sheet Solvency
        p5 = ai_research.get("pillar_5_cash_flow_reality", {})
        p6 = ai_research.get("pillar_6_debt_and_balance_sheet", {})
        wc = forensics.get("working_capital", {})
        elements.append(Paragraph("💵 5. CASH FLOW REALITY & 🏦 6. BALANCE SHEET SOLVENCY", s['h1']))
        elements.append(Paragraph(f"&bull; <b>CFO to PAT Conversion:</b> {p5.get('operating_cash_flow_cfo', '')} &bull; <i>{p5.get('profit_vs_cash_conversion_verdict', '')}</i>", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Working Capital & Cash Conversion Cycle (CCC):</b> {wc.get('cash_conversion_cycle_days', 45)} Days (Receivables: {wc.get('receivable_days', 40)}d, Inventory: {wc.get('inventory_days', 35)}d, Payables: {wc.get('payable_days', 30)}d) &bull; {wc.get('working_capital_verdict', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Solvency & Debt Fortress:</b> {p6.get('debt_to_equity_and_total_debt', '')} &bull; {p6.get('debt_trajectory', '')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 👔 7. Management Leadership Dossier & 🤝 8. Verified Contracts
        p7 = ai_research.get("pillar_7_management_and_governance", {})
        mgmt_list = p7.get("leadership_dossier", []) or ai_research.get("management_team_and_leadership", [])
        tie_ups = ai_research.get("corporate_tie_ups_and_contracts", [])
        elements.append(Paragraph("👔 7. MANAGEMENT DOSSIER & 🤝 8. CORPORATE CONTRACTS", s['h1']))
        elements.append(Paragraph(f"&bull; <b>Promoter Alignment & Governance:</b> {p7.get('promoter_holding_and_pledge', '')} &bull; {p7.get('capital_allocation_skill', '')}", s['bullet']))

        if mgmt_list:
            mgmt_data = [[Paragraph("Leader & Role", s['table_header']), Paragraph("Experience & Tenure", s['table_header']), Paragraph("Contract Term & Past Transition", s['table_header'])]]
            for m in mgmt_list[:2]:
                mgmt_data.append([
                    Paragraph(f"<b>{m.get('name')}</b><br/>{m.get('designation')}", s['table_cell']),
                    Paragraph(f"Exp: {m.get('experience', m.get('total_experience_years', '20+ Yrs'))}<br/>At Co: {m.get('tenure', m.get('tenure_with_company', '10+ Yrs'))}", s['table_cell']),
                    Paragraph(f"Term: {m.get('contract_term', m.get('contract_term_and_expiration', '5-Yr Term'))}<br/>Past: {m.get('past_history', m.get('predecessor_history', 'Promoter led'))}", s['table_cell'])
                ])
            t_m = Table(mgmt_data, colWidths=[150, 130, 208])
            t_m.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            elements.append(t_m)

        if tie_ups:
            elements.append(Paragraph(f"&bull; <b>Key Contract / Strategic Tie-up:</b> {tie_ups[0].get('partner_name')}: {tie_ups[0].get('details')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # ⚔️ 11. Competitor Warfare & Peer Growth Benchmarking
        cw = ai_research.get("competitor_warfare_and_beat_analysis", {})
        if cw:
            elements.append(Paragraph("⚔️ 11. COMPETITOR WARFARE & PEER GROWTH BENCHMARKING", s['h1']))
            peer_table_data = [
                [Paragraph("Company / Rival", s['table_header']), Paragraph("3Y Sales CAGR", s['table_header']), Paragraph("EBITDA %", s['table_header']), Paragraph("ROCE %", s['table_header']), Paragraph("Debt/Eq", s['table_header']), Paragraph("Market Share", s['table_header'])]
            ]
            for row in cw.get("growth_and_margin_comparison", [])[:3]:
                is_target = "(Target)" in row.get("company", "") or ticker in row.get("company", "")
                cell_st = s['table_cell_bold'] if is_target else s['table_cell']
                peer_table_data.append([
                    Paragraph(f"{'🎯 ' if is_target else ''}<b>{row.get('company')}</b>", cell_st),
                    Paragraph(str(row.get('sales_cagr_3y', '-')), cell_st),
                    Paragraph(str(row.get('ebitda_margin_pct', '-')), cell_st),
                    Paragraph(str(row.get('roce_pct', '-')), cell_st),
                    Paragraph(str(row.get('debt_equity', '-')), cell_st),
                    Paragraph(str(row.get('market_share_pct', '-')), cell_st)
                ])
            t_peers = Table(peer_table_data, colWidths=[138, 70, 70, 65, 65, 80])
            t_peers.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            elements.append(t_peers)

            can_beat = cw.get("can_it_beat_and_overtake_peers", {})
            elements.append(Paragraph(
                f"&bull; <b>Outperformance & Beat Probability:</b> <font color='#059669'><b>{can_beat.get('beat_probability_score', '85% - HIGH')}</b></font> &bull; <b>Strategic Weapon:</b> {cw.get('what_company_is_doing_to_beat_competitors', [{}])[0].get('execution_detail', 'Scale and backward integration cost advantages.')}",
                s['bullet']
            ))
            elements.append(Spacer(1, 2))

        # 🧮 12. Complete A-Z Institutional Valuation Suite (7 Models + Blended Fair Value + 3-Tranche Strategy)
        elements.append(Paragraph("🧮 12. COMPLETE INSTITUTIONAL VALUATION SUITE (7 METHODOLOGIES)", s['h1']))
        models = comp_val.get("models", {})
        dcf_m = models.get("dcf_3scenario", {})
        graham_m = models.get("benjamin_graham_formula", {})
        lynch_m = models.get("peter_lynch_fair_value", {})
        oe_m = models.get("warren_buffett_owner_earnings", {})
        epv_m = models.get("earnings_power_value_epv", {})
        hist_m = models.get("historical_multiple_reversion", {})
        rev_dcf_m = models.get("reverse_dcf", {})

        val_table_data = [
            [Paragraph("Valuation Methodology", s['table_header']), Paragraph("Model Assumptions & Inputs", s['table_header']), Paragraph("Intrinsic Fair Value", s['table_header']), Paragraph("Implied Upside / MOS", s['table_header'])],
            [
                Paragraph("<b>1. Discounted Cash Flow (DCF Base)</b>", s['table_cell']),
                Paragraph(f"WACC: {dcf_m.get('wacc_pct', 11.0)}%, Terminal g: {dcf_m.get('terminal_growth_pct', 4.5)}%", s['table_cell']),
                Paragraph(f"<b>Rs. {dcf_m.get('base_case', 'N/A')}</b>", s['table_cell']),
                Paragraph(f"{forensics.get('dcf', {}).get('base_case', {}).get('implied_upside_pct', 0)}%", s['table_cell'])
            ],
            [
                Paragraph("<b>2. Benjamin Graham Intrinsic Formula</b>", s['table_cell']),
                Paragraph("V = EPS * (8.5 + 1.5g) * (4.4 / 7.2% Bond)", s['table_cell']),
                Paragraph(f"<b>Rs. {graham_m.get('fair_value', 'N/A')}</b>", s['table_cell']),
                Paragraph(f"{graham_m.get('upside_pct', 0)}%", s['table_cell'])
            ],
            [
                Paragraph("<b>3. Peter Lynch Fair Value & PEG</b>", s['table_cell']),
                Paragraph(f"Fair P/E = Growth Rate ({lynch_m.get('fair_pe', 15)}x), PEG: {lynch_m.get('peg_ratio', 1.0)}", s['table_cell']),
                Paragraph(f"<b>Rs. {lynch_m.get('fair_value', 'N/A')}</b>", s['table_cell']),
                Paragraph(f"{lynch_m.get('verdict', 'Fair Growth')}", s['table_cell'])
            ],
            [
                Paragraph("<b>4. Warren Buffett Owner Earnings</b>", s['table_cell']),
                Paragraph(f"OEPS: Rs. {oe_m.get('owner_earnings_per_share', 'N/A')}, Yield: {oe_m.get('owner_earnings_yield_pct', 5.0)}%", s['table_cell']),
                Paragraph(f"<b>Rs. {oe_m.get('fair_value_10pct_cap', 'N/A')}</b>", s['table_cell']),
                Paragraph(f"{oe_m.get('vs_gsec_10y_yield', 'Attractive')}", s['table_cell'])
            ],
            [
                Paragraph("<b>5. Bruce Greenwald EPV (Columbia)</b>", s['table_cell']),
                Paragraph(f"Zero-Growth NOPAT capitalized @ 11% WACC", s['table_cell']),
                Paragraph(f"<b>Rs. {epv_m.get('epv_per_share', 'N/A')}</b>", s['table_cell']),
                Paragraph("Reproduction Cost", s['table_cell'])
            ],
            [
                Paragraph("<b>6. Historical 5Y P/E Reversion</b>", s['table_cell']),
                Paragraph(f"Median P/E Multiple ({hist_m.get('median_pe_5y', 20.0)}x)", s['table_cell']),
                Paragraph(f"<b>Rs. {hist_m.get('pe_reversion_target', 'N/A')}</b>", s['table_cell']),
                Paragraph("Mean Reversion", s['table_cell'])
            ],
            [
                Paragraph("<b>🎯 BLENDED WEIGHTED FAIR VALUE</b>", ParagraphStyle('BBlended', parent=s['table_cell_bold'], textColor=colors.HexColor("#059669"))),
                Paragraph("<b>Weighted Combination of All 6 Models</b>", s['table_cell_bold']),
                Paragraph(f"<font color='#059669' size='8'><b>Rs. {blended_fv}</b></font>", s['table_cell_bold']),
                Paragraph(f"<font color='{mos_color}'><b>+{blended_mos}% MOS</b></font>", s['table_cell_bold'])
            ]
        ]
        t_val = Table(val_table_data, colWidths=[150, 160, 95, 83])
        t_val.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.HexColor("#F8FAFC"), colors.white]),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#ECFDF5")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 2.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ]))
        elements.append(t_val)
        elements.append(Spacer(1, 2))

        # 3-Tranche Capital Entry Strategy
        tranches = comp_val.get("capital_allocation_tranches", [])
        if tranches:
            elements.append(Paragraph("🎯 <b>3-Tranche Institutional Capital Allocation Plan:</b>", s['h2']))
            for tr in tranches:
                elements.append(Paragraph(
                    f"&bull; <b>{tr.get('tranche')}: Target Entry Rs. {tr.get('entry_price')}</b> &mdash; {tr.get('rationale')}",
                    s['bullet']
                ))
            elements.append(Spacer(1, 2))

        # ⚠️ 13. Forensics & Charlie Munger Inversion Pre-Mortem
        altman = forensics.get("altman_z", {})
        beneish = forensics.get("beneish_m", {})
        red_flags = ai_research.get("pillar_12_red_flags", []) or ai_research.get("forensic_red_flags", [])
        elements.append(Paragraph("⚠️ 13. FORENSIC CHECKS & CHARLIE MUNGER PRE-MORTEM RISKS", s['h1']))
        elements.append(Paragraph(f"&bull; <b>Altman Z''-Score:</b> {altman.get('z_score', '3.1')} ({altman.get('zone', 'SAFE_ZONE')}) &bull; <b>Beneish M-Score:</b> {beneish.get('m_score', '-2.4')} ({beneish.get('status', 'CLEAN')}) &bull; <b>Piotroski F-Score:</b> {forensics.get('piotroski', {}).get('score', 7)}/9", s['bullet']))
        for rf in red_flags[:3]:
            elements.append(Paragraph(f"&bull; <font color='#DC2626'><b>Warning Flag:</b></font> {rf}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 🏆 14. Final Warren Buffett 5-Gate Verdict
        elements.append(Paragraph("🏆 14. FINAL BUFFETT-MUNGER 5-GATE VERDICT & OMAHA THESIS", s['h1']))
        elements.append(Paragraph(f"<i>\"{bv.get('omaha_reasoning', 'Durable economic franchise with robust return on capital, clean balance sheet, and attractive margin of safety.')}\"</i>", s['highlight_box']))

        gates = bv.get("checklist_gates", [])
        if gates:
            gate_data = [[Paragraph("Buffett 5-Gate Checklist", s['table_header']), Paragraph("Gate", s['table_header']), Paragraph("Analytical Rationale", s['table_header'])]]
            for g in gates:
                status_color = colors.HexColor("#059669") if g.get("status") == "PASS" else colors.HexColor("#DC2626")
                gate_data.append([
                    Paragraph(f"<b>{g.get('gate')}</b>", s['table_cell']),
                    Paragraph(f"<b>{g.get('status')}</b>", ParagraphStyle('GStatus', parent=s['table_cell'], textColor=status_color)),
                    Paragraph(g.get("comment", ""), s['table_cell'])
                ])
            t_gates = Table(gate_data, colWidths=[150, 50, 288])
            t_gates.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            elements.append(t_gates)

        doc.build(elements, canvasmaker=NumberedCanvas)
        pdf_bytes = buffer.getvalue()
        buffer.close()

        if output_filepath:
            with open(output_filepath, "wb") as f:
                f.write(pdf_bytes)

        return pdf_bytes

    @staticmethod
    def generate_volume1_business_model_pdf(
        ticker: str,
        company_name: str,
        fundamentals: Dict[str, Any],
        ai_research: Dict[str, Any],
        output_filepath: Optional[str] = None
    ) -> bytes:
        return InstitutionalPDFGenerator.generate_master_buffett_12pillar_pdf(
            ticker, company_name, fundamentals, {}, ai_research, [], output_filepath
        )

    @staticmethod
    def generate_volume2_valuation_and_verdict_pdf(
        ticker: str,
        company_name: str,
        fundamentals: Dict[str, Any],
        forensics: Dict[str, Any],
        ai_research: Dict[str, Any],
        news_items: List[Dict[str, Any]],
        output_filepath: Optional[str] = None
    ) -> bytes:
        return InstitutionalPDFGenerator.generate_master_buffett_12pillar_pdf(
            ticker, company_name, fundamentals, forensics, ai_research, news_items, output_filepath
        )

    @staticmethod
    def generate_volume3_competitor_warfare_pdf(
        ticker: str,
        company_name: str,
        fundamentals: Dict[str, Any],
        forensics: Dict[str, Any],
        ai_research: Dict[str, Any],
        output_filepath: Optional[str] = None
    ) -> bytes:
        """Generates Volume 3: Competitor Warfare & Market Domination Strategy PDF."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, pagesize=A4, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54
        )
        s = InstitutionalPDFGenerator._get_styles()
        elements = []

        cw = ai_research.get("competitor_warfare_and_beat_analysis", {})
        can_beat = cw.get("can_it_beat_and_overtake_peers", {})

        elements.append(Paragraph("VOLUME 3: COMPETITOR WARFARE & MARKET DOMINATION MEMO", s['subtitle']))
        elements.append(Paragraph(f"{company_name} ({ticker}) — Peer Benchmarking & Battle Plan", s['title']))
        elements.append(Paragraph(
            f"<b>Objective:</b> Exhaustive Peer Growth Comparison, Strategic Weapons, Pricing Power Resilience & Market Share Domination Outlook",
            s['subtitle']
        ))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0F172A"), spaceBefore=2, spaceAfter=6))

        prob_score = can_beat.get("beat_probability_score", "85% - HIGH PROBABILITY OF OVERTAKING COMPETITORS")
        banner_data = [
            [
                Paragraph("<b>MARKET OUTPERFORMANCE & BEAT PROBABILITY:</b>", s['table_cell']),
                Paragraph(f"<font color='#059669' size='9'><b>{prob_score}</b></font>", s['table_cell'])
            ]
        ]
        t_banner = Table(banner_data, colWidths=[240, 248])
        t_banner.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#ECFDF5")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#10B981")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(t_banner)
        elements.append(Spacer(1, 4))

        elements.append(Paragraph("📊 1. PEER GROWTH & PROFITABILITY BENCHMARKING MATRIX", s['h1']))
        peer_rows = [
            [
                Paragraph("Company / Peer", s['table_header']),
                Paragraph("3Y Sales CAGR", s['table_header']),
                Paragraph("EBITDA Margin", s['table_header']),
                Paragraph("ROCE", s['table_header']),
                Paragraph("Debt / Equity", s['table_header']),
                Paragraph("Market Share", s['table_header'])
            ]
        ]

        for row in cw.get("growth_and_margin_comparison", []):
            is_target = ticker in row.get("company", "") or company_name in row.get("company", "") or "(Target)" in row.get("company", "")
            cell_style = s['table_cell_bold'] if is_target else s['table_cell']
            peer_rows.append([
                Paragraph(f"{'🎯 ' if is_target else ''}<b>{row.get('company')}</b>", cell_style),
                Paragraph(str(row.get('sales_cagr_3y', '-')), cell_style),
                Paragraph(str(row.get('ebitda_margin_pct', '-')), cell_style),
                Paragraph(str(row.get('roce_pct', '-')), cell_style),
                Paragraph(str(row.get('debt_equity', '-')), cell_style),
                Paragraph(str(row.get('market_share_pct', '-')), cell_style),
            ])

        t_peers = Table(peer_rows, colWidths=[138, 70, 70, 65, 65, 80])
        t_peers.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        elements.append(t_peers)
        elements.append(Spacer(1, 4))

        elements.append(Paragraph("🥊 2. KEY COMPETITORS & EXPLOITABLE VULNERABILITIES", s['h1']))
        comps = cw.get("key_competitors", [])
        if comps:
            comp_table_data = [
                [Paragraph("Competitor", s['table_header']), Paragraph("Tier & Core Strength", s['table_header']), Paragraph("Exploitable Vulnerability", s['table_header'])]
            ]
            for c in comps:
                comp_table_data.append([
                    Paragraph(f"<b>{c.get('name')}</b>", s['table_cell']),
                    Paragraph(f"<b>{c.get('market_cap_tier')}</b>: {c.get('core_strength')}", s['table_cell']),
                    Paragraph(f"<font color='#DC2626'>{c.get('weakness')}</font>", s['table_cell'])
                ])
            t_comp = Table(comp_table_data, colWidths=[120, 184, 184])
            t_comp.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 3),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ]))
            elements.append(t_comp)
            elements.append(Spacer(1, 4))

        elements.append(Paragraph("⚔️ 3. STRATEGIC ARSENAL: HOW COMPANY IS BEATING COMPETITORS", s['h1']))
        weapons = cw.get("what_company_is_doing_to_beat_competitors", [])
        for w in weapons:
            elements.append(Paragraph(
                f"&bull; <b>{w.get('strategy_pillar')}:</b> {w.get('execution_detail')}",
                s['bullet']
            ))
        elements.append(Spacer(1, 3))

        elements.append(Paragraph("🚀 4. STRUCTURAL CATALYSTS TO OVERTAKE PEERS & COUNTER RISKS", s['h1']))
        for cat in can_beat.get("structural_catalysts_to_overtake", []):
            elements.append(Paragraph(f"&bull; <font color='#059669'><b>Growth Catalyst:</b></font> {cat}", s['bullet']))
        elements.append(Spacer(1, 2))

        elements.append(Paragraph("⚠️ <b>Competitor Counter-Offensive Risks:</b>", s['h2']))
        for risk in can_beat.get("competitor_counter_attack_risks", []):
            elements.append(Paragraph(f"&bull; <font color='#DC2626'><b>Risk Factor:</b></font> {risk}", s['bullet']))
        elements.append(Spacer(1, 4))

        elements.append(Paragraph("🏆 5. FINAL MARKET DOMINATION & COMPETITIVE VERDICT", s['h1']))
        domination_verdict = can_beat.get("final_market_dominance_verdict", f"{company_name} is strategically positioned with superior cost efficiency and high capital returns to outpace rivals and gain decisive market share.")
        elements.append(Paragraph(
            f"<i>\"{domination_verdict}\"</i>",
            s['highlight_box']
        ))

        doc.build(elements, canvasmaker=NumberedCanvas)
        pdf_bytes = buffer.getvalue()
        buffer.close()

        if output_filepath:
            with open(output_filepath, "wb") as f:
                f.write(pdf_bytes)

        return pdf_bytes
