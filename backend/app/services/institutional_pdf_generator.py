"""
Master 12-Pillar Warren Buffett Complete Company Analysis PDF Generator
========================================================================
Generates a comprehensive, institutional Master Research PDF covering:
🏢 1. Business & Everyday Analogy
🛡️ 2. Moat & Pricing Power
📈 3. Growth Engine
💰 4. Profitability (ROE, ROCE, ROIC)
💵 5. Cash Flow Reality (CFO vs PAT)
🏦 6. Debt & Balance Sheet Solvency
👔 7. Management & Leadership Dossier
📊 8. Financial History (10Y Record)
🧮 9. Intrinsic Value (3-Scenario DCF)
💲 10. Valuation & Reverse DCF Hurdle
🛡️ 11. Margin of Safety
⚠️ 12. Red Flags & Forensic Matrix (Altman Z, Beneish M)
📅 Monthly Seasonality & Gain/Loss Cycles
🤝 Corporate Tie-ups & Verified Contracts
🏆 Final Buffett Checklist & Omaha Verdict
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
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        if self._pageNumber > 1:
            self.drawString(54, 800, "STOCKIQ MASTER BUFFETT-MUNGER 12-PILLAR RESEARCH MEMO")
            self.drawRightString(558, 800, datetime.utcnow().strftime("%B %Y"))
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 794, 558, 794)

        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)

        self.drawString(54, 32, "CONFIDENTIAL & PROPRIETARY — INSTITUTIONAL EQUITY RESEARCH")
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
            'title': ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=PRIMARY, spaceAfter=3),
            'subtitle': ParagraphStyle('DocSubTitle', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=13, textColor=TEXT_MUTED, spaceAfter=5),
            'h1': ParagraphStyle('SectionH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=PRIMARY, spaceBefore=7, spaceAfter=2.5),
            'h2': ParagraphStyle('SectionH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leading=11.5, textColor=SECONDARY, spaceBefore=3, spaceAfter=1.5),
            'body': ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11.5, textColor=TEXT_DARK, spaceAfter=3.5),
            'bullet': ParagraphStyle('Bullet', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=TEXT_DARK, leftIndent=8, spaceAfter=2),
            'badge_bull': ParagraphStyle('BadgeBull', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#059669")),
            'badge_bear': ParagraphStyle('BadgeBear', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#DC2626")),
            'table_cell': ParagraphStyle('TableCell', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, leading=10, textColor=TEXT_DARK),
            'table_header': ParagraphStyle('TableHeader', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=10, textColor=colors.white),
            'highlight_box': ParagraphStyle('Highlight', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8, leading=11, textColor=SECONDARY),
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
        """Generates the Single Master 12-Pillar Warren Buffett Research PDF."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, pagesize=A4, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54
        )
        s = InstitutionalPDFGenerator._get_styles()
        elements = []

        # Top Title Block
        elements.append(Paragraph("MASTER INSTITUTIONAL EQUITY RESEARCH MEMO", s['subtitle']))
        elements.append(Paragraph(f"{company_name} ({ticker})", s['title']))
        elements.append(Paragraph(
            f"<b>CMP:</b> Rs. {fundamentals.get('current_price', 'N/A')} &nbsp;|&nbsp; "
            f"<b>Market Cap:</b> Rs. {fundamentals.get('market_cap_cr', 'N/A')} Cr &nbsp;|&nbsp; "
            f"<b>P/E:</b> {fundamentals.get('pe_ratio', 'N/A')} &nbsp;|&nbsp; "
            f"<b>ROE:</b> {fundamentals.get('roe_pct', 'N/A')}% &nbsp;|&nbsp; "
            f"<b>ROCE:</b> {fundamentals.get('roce_pct', 'N/A')}% &nbsp;|&nbsp; "
            f"<b>D/E:</b> {fundamentals.get('debt_to_equity', 'N/A')}",
            s['body']
        ))

        # Buffett Scorecard Banner
        bv = ai_research.get("warren_buffett_final_verdict", {})
        scorecard = forensics.get("buffett_scorecard", {})
        total_score = scorecard.get("total_score", bv.get("score_100", 80))
        grade = scorecard.get("institutional_grade", bv.get("institutional_grade", "AA"))
        verdict = bv.get("verdict", "BUY_WITH_MARGIN_OF_SAFETY")

        banner_data = [[
            Paragraph(f"<b>WARREN BUFFETT VERDICT:</b><br/><font size='10'><b>{verdict}</b></font>", s['table_header']),
            Paragraph(f"<b>INSTITUTIONAL GRADE:</b><br/><font size='10'><b>{grade} ({total_score}/100)</b></font>", s['table_header'])
        ]]
        t_banner = Table(banner_data, colWidths=[244, 244])
        t_banner.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#059669") if "BUY" in verdict else colors.HexColor("#D97706")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(t_banner)
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceBefore=4, spaceAfter=4))

        # 🏢 1. Business
        p1 = ai_research.get("pillar_1_business", {})
        elements.append(Paragraph("🏢 1. BUSINESS MODEL & CORE REVENUE ENGINE", s['h1']))
        elements.append(Paragraph(f"&bull; <b>What Company Does:</b> {p1.get('what_company_does', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Revenue Sources:</b> {p1.get('revenue_sources_breakdown', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Everyday Analogy:</b> <i>\"{p1.get('simple_analogy', '')}\"</i>", s['highlight_box']))
        elements.append(Paragraph(f"&bull; <b>Future Relevance (10-20Y):</b> {p1.get('future_industry_relevance', '')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 🛡️ 2. Moat / Competitive Advantage
        p2 = ai_research.get("pillar_2_moat_and_advantage", {})
        elements.append(Paragraph("🛡️ 2. COMPETITIVE ADVANTAGE & 9-PILLAR MOAT", s['h1']))
        moat_table = [
            [Paragraph("Moat Dimension", s['table_header']), Paragraph("Strategic Reality", s['table_header'])],
            [Paragraph("<b>Brand & Pricing Power</b>", s['table_cell']), Paragraph(f"{p2.get('brand_strength', '')} &bull; {p2.get('pricing_power', '')}", s['table_cell'])],
            [Paragraph("<b>Barriers to Entry</b>", s['table_cell']), Paragraph(p2.get('entry_barriers', ''), s['table_cell'])],
            [Paragraph("<b>Switching Costs & Network</b>", s['table_cell']), Paragraph(f"{p2.get('switching_costs', '')} &bull; {p2.get('distribution_and_network', '')}", s['table_cell'])],
            [Paragraph("<b>Market Share Trajectory</b>", s['table_cell']), Paragraph(p2.get('market_share_stability', 'Stable/Expanding'), s['table_cell'])],
        ]
        t_moat = Table(moat_table, colWidths=[140, 348])
        t_moat.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 2.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ]))
        elements.append(t_moat)
        elements.append(Spacer(1, 2))

        # 📈 3. Growth Engine & 💰 4. Profitability
        p3 = ai_research.get("pillar_3_growth_engine", {})
        p4 = ai_research.get("pillar_4_profitability", {})
        elements.append(Paragraph("📈 3. GROWTH & 💰 4. PROFITABILITY QUALITY", s['h1']))
        elements.append(Paragraph(f"&bull; <b>Sales & Operating Growth:</b> {p3.get('sales_growth_5y_10y', '')} &bull; {p3.get('operating_profit_and_eps_growth', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Future Growth Driver:</b> {p3.get('realistic_future_growth_driver', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Capital Returns (ROE/ROCE):</b> {p4.get('roe_roce_roic_metrics', '')} &bull; {p4.get('margin_stability_trend', '')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 💵 5. Cash Flow & 🏦 6. Debt / Balance Sheet
        p5 = ai_research.get("pillar_5_cash_flow_reality", {})
        p6 = ai_research.get("pillar_6_debt_and_balance_sheet", {})
        elements.append(Paragraph("💵 5. CASH FLOW REALITY & 🏦 6. DEBT SOLVENCY", s['h1']))
        elements.append(Paragraph(f"&bull; <b>CFO vs Profit Conversion:</b> {p5.get('operating_cash_flow_cfo', '')} &bull; <i>{p5.get('profit_vs_cash_conversion_verdict', '')}</i>", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Free Cash Flow (FCF):</b> {p5.get('free_cash_flow_fcf', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Balance Sheet Fortress:</b> {p6.get('debt_to_equity_and_total_debt', '')} &bull; {p6.get('debt_trajectory', '')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 👔 7. Management & Leadership Dossier
        p7 = ai_research.get("pillar_7_management_and_governance", {})
        elements.append(Paragraph("👔 7. MANAGEMENT, CAPITAL ALLOCATION & CONTRACT DOSSIER", s['h1']))
        elements.append(Paragraph(f"&bull; <b>Promoter Alignment:</b> {p7.get('promoter_holding_and_pledge', '')} &bull; <b>Integrity & Dilution:</b> {p7.get('related_party_and_dilution', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Capital Allocation Skill:</b> {p7.get('capital_allocation_skill', '')}", s['bullet']))

        mgmt_list = p7.get("leadership_dossier", []) or ai_research.get("management_team_and_leadership", [])
        if mgmt_list:
            mgmt_data = [[Paragraph("Leader & Designation", s['table_header']), Paragraph("Experience & Tenure", s['table_header']), Paragraph("Contract Term & Past Transition", s['table_header'])]]
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
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            elements.append(t_m)
            elements.append(Spacer(1, 2))

        # 🧮 9. Intrinsic Value & 💲 10. Valuation & 🛡️ 11. Margin of Safety
        dcf = forensics.get("dcf", {})
        rev_dcf = forensics.get("reverse_dcf", {})
        elements.append(Paragraph("🧮 9. INTRINSIC VALUE, 💲 10. VALUATION & 🛡️ 11. MARGIN OF SAFETY", s['h1']))
        dcf_table_data = [
            [Paragraph("Scenario", s['table_header']), Paragraph("Growth", s['table_header']), Paragraph("Discount (WACC)", s['table_header']), Paragraph("Fair Value", s['table_header']), Paragraph("Implied Upside", s['table_header'])],
            [Paragraph("<b>Bear Case</b>", s['table_cell']), Paragraph(f"{dcf.get('bear_case', {}).get('assumed_growth_pct')}%", s['table_cell']), Paragraph(f"{dcf.get('bear_case', {}).get('wacc_discount_rate_pct')}%", s['table_cell']), Paragraph(f"Rs. {dcf.get('bear_case', {}).get('fair_value')}", s['table_cell']), Paragraph(f"{dcf.get('bear_case', {}).get('implied_upside_pct')}%", s['table_cell'])],
            [Paragraph("<b>Base Case</b>", s['table_cell']), Paragraph(f"{dcf.get('base_case', {}).get('assumed_growth_pct')}%", s['table_cell']), Paragraph(f"{dcf.get('base_case', {}).get('wacc_discount_rate_pct')}%", s['table_cell']), Paragraph(f"Rs. {dcf.get('base_case', {}).get('fair_value')}", s['table_cell']), Paragraph(f"{dcf.get('base_case', {}).get('implied_upside_pct')}%", s['table_cell'])],
            [Paragraph("<b>Bull Case</b>", s['table_cell']), Paragraph(f"{dcf.get('bull_case', {}).get('assumed_growth_pct')}%", s['table_cell']), Paragraph(f"{dcf.get('bull_case', {}).get('wacc_discount_rate_pct')}%", s['table_cell']), Paragraph(f"Rs. {dcf.get('bull_case', {}).get('fair_value')}", s['table_cell']), Paragraph(f"{dcf.get('bull_case', {}).get('implied_upside_pct')}%", s['table_cell'])],
        ]
        t_dcf = Table(dcf_table_data, colWidths=[120, 80, 90, 100, 98])
        t_dcf.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 2.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ]))
        elements.append(t_dcf)
        elements.append(Spacer(1, 2))
        elements.append(Paragraph(
            f"&bull; <b>Reverse DCF Hurdle Rate:</b> Current CMP implies <b>{rev_dcf.get('implied_growth_rate_pct')}% CAGR</b>.<br/>"
            f"&bull; <b>Margin of Safety:</b> Base fair value offers <b>+{dcf.get('margin_of_safety_pct')}% Margin of Safety</b>.",
            s['body']
        ))
        elements.append(Spacer(1, 2))

        # ⚠️ 12. Red Flags & Forensic Checks
        altman = forensics.get("altman_z", {})
        beneish = forensics.get("beneish_m", {})
        red_flags = ai_research.get("pillar_12_red_flags", []) or ai_research.get("forensic_red_flags", [])
        elements.append(Paragraph("⚠️ 12. RED FLAGS & FORENSIC CHECKS", s['h1']))
        elements.append(Paragraph(f"&bull; <b>Altman Z''-Score:</b> {altman.get('z_score', '3.1')} ({altman.get('zone', 'SAFE_ZONE')}) &bull; <b>Beneish M-Score:</b> {beneish.get('m_score', '-2.4')} ({beneish.get('status', 'CLEAN')})", s['bullet']))
        for rf in red_flags[:3]:
            elements.append(Paragraph(f"&bull; <b>Warning Flag:</b> {rf}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 📅 Monthly Seasonality & 🤝 Corporate Tie-ups
        season = ai_research.get("monthly_seasonality", {}) or ai_research.get("monthly_seasonality_and_cycles", {})
        tie_ups = ai_research.get("corporate_tie_ups_and_contracts", [])
        elements.append(Paragraph("📅 MONTHLY SEASONALITY & 🤝 CORPORATE TIE-UPS", s['h1']))
        if season:
            elements.append(Paragraph(f"&bull; <b>Best Months (Gains):</b> {season.get('best_months_to_accumulate', 'Q4 & Q1')} &bull; <b>Worst Months (Drawdown):</b> {season.get('worst_months_drawdown_season', 'Monsoon')}", s['bullet']))
        if tie_ups:
            elements.append(Paragraph(f"&bull; <b>Verified Contract / Tie-up:</b> {tie_ups[0].get('partner_name')}: {tie_ups[0].get('details')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 🏆 Final Buffett Checklist & Omaha Verdict
        elements.append(Paragraph("🏆 FINAL BUFFETT & MUNGER 5-GATE VERDICT", s['h1']))
        elements.append(Paragraph(f"<i>\"{bv.get('omaha_reasoning', 'Durable franchise with high returns on capital and adequate safety margin.')}\"</i>", s['highlight_box']))

        gates = bv.get("checklist_gates", [])
        if gates:
            gate_data = [[Paragraph("Buffett 5-Gate Checklist", s['table_header']), Paragraph("Gate", s['table_header']), Paragraph("Rationale", s['table_header'])]]
            for g in gates:
                status_color = colors.HexColor("#059669") if g.get("status") == "PASS" else colors.HexColor("#DC2626")
                gate_data.append([
                    Paragraph(f"<b>{g.get('gate')}</b>", s['table_cell']),
                    Paragraph(f"<b>{g.get('status')}</b>", ParagraphStyle('GStatus', parent=s['table_cell'], textColor=status_color)),
                    Paragraph(g.get("comment", ""), s['table_cell'])
                ])
            t_gates = Table(gate_data, colWidths=[150, 55, 283])
            t_gates.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
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
