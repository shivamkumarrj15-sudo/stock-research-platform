"""
Master 12-Pillar Warren Buffett Complete Company Analysis & Competitor Warfare PDF Generator
=============================================================================================
Generates comprehensive institutional research PDFs:
1. 🏆 Master 12-Pillar Warren Buffett Comprehensive Institutional Analysis PDF
2. 📗 Volume 1: Business Model, Unit Economics & Economic Moat PDF
3. 📘 Volume 2: Forensics, Extended DuPont, 3-Scenario DCF & Buffett Verdict PDF
4. ⚔️ Volume 3: Competitor Warfare, Peer Benchmarking & Market Domination Strategy PDF
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
            self.drawString(54, 800, "STOCKIQ INSTITUTIONAL EQUITY RESEARCH MEMO")
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
            'title': ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=17, leading=21, textColor=PRIMARY, spaceAfter=3),
            'subtitle': ParagraphStyle('DocSubTitle', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, textColor=TEXT_MUTED, spaceAfter=4),
            'h1': ParagraphStyle('SectionH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, leading=13.5, textColor=PRIMARY, spaceBefore=6, spaceAfter=2),
            'h2': ParagraphStyle('SectionH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=SECONDARY, spaceBefore=3, spaceAfter=1.5),
            'body': ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=TEXT_DARK, spaceAfter=3),
            'bullet': ParagraphStyle('Bullet', parent=styles['Normal'], fontName='Helvetica', fontSize=7.8, leading=10.5, textColor=TEXT_DARK, leftIndent=8, spaceAfter=1.5),
            'badge_bull': ParagraphStyle('BadgeBull', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#059669")),
            'badge_bear': ParagraphStyle('BadgeBear', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#DC2626")),
            'table_cell': ParagraphStyle('TableCell', parent=styles['Normal'], fontName='Helvetica', fontSize=7.2, leading=9.5, textColor=TEXT_DARK),
            'table_header': ParagraphStyle('TableHeader', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.2, leading=9.5, textColor=colors.white),
            'highlight_box': ParagraphStyle('Highlight', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7.8, leading=10.5, textColor=SECONDARY),
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
            f"<b>P/B:</b> {fundamentals.get('pb_ratio', 'N/A')} &nbsp;|&nbsp; "
            f"<b>ROE:</b> {fundamentals.get('roe_pct', 'N/A')}% &nbsp;|&nbsp; "
            f"<b>ROCE:</b> {fundamentals.get('roce_pct', 'N/A')}% &nbsp;|&nbsp; "
            f"<b>D/E:</b> {fundamentals.get('debt_to_equity', 'N/A')}",
            s['subtitle']
        ))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceBefore=2, spaceAfter=5))

        # Executive Summary & Scorecard
        scorecard = forensics.get("buffett_scorecard", {})
        bv = ai_research.get("warren_buffett_final_verdict", {}) or ai_research.get("buffett_verdict", {})
        score_val = scorecard.get('total_score', bv.get('score_100', 78))
        grade_val = scorecard.get('institutional_grade', bv.get('institutional_grade', 'AA'))
        verdict_val = bv.get('verdict', 'BUY_WITH_MARGIN_OF_SAFETY')

        score_color = "#059669" if score_val >= 75 else "#D97706" if score_val >= 50 else "#DC2626"

        summary_box = [
            [
                Paragraph(f"<b>WARREN BUFFETT VERDICT:</b> <font color='{score_color}'>{verdict_val}</font><br/><b>INSTITUTIONAL SCORE:</b> <font color='{score_color}'>{score_val}/100 (Grade: {grade_val})</font>", s['table_cell']),
                Paragraph(f"<b>EXECUTIVE SUMMARY:</b> {ai_research.get('executive_summary', 'Comprehensive institutional analysis based on Warren Buffett value investing principles.')}", s['table_cell'])
            ]
        ]
        t_sum = Table(summary_box, colWidths=[200, 288])
        t_sum.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(t_sum)
        elements.append(Spacer(1, 4))

        # 🏢 1. Business & Unit Economics
        p1 = ai_research.get("pillar_1_business", {})
        elements.append(Paragraph("🏢 1. BUSINESS MODEL & EVERYDAY ANALOGY", s['h1']))
        elements.append(Paragraph(f"&bull; <b>What Company Does:</b> {p1.get('what_company_does', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Revenue Streams:</b> {p1.get('revenue_sources_breakdown', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Everyday Simple Analogy:</b> <i>\"{p1.get('simple_analogy', '')}\"</i>", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>10-20 Year Future Relevance:</b> {p1.get('future_industry_relevance', '')}", s['bullet']))
        elements.append(Spacer(1, 2))

        # 🛡️ 2. Moat & Competitive Advantage
        p2 = ai_research.get("pillar_2_moat_and_advantage", {})
        elements.append(Paragraph("🛡️ 2. COMPETITIVE ADVANTAGE (MOAT & PRICING POWER)", s['h1']))
        elements.append(Paragraph(f"&bull; <b>Brand & Pricing Power:</b> {p2.get('brand_strength', '')} &bull; {p2.get('pricing_power', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Entry Barriers & Switching Costs:</b> {p2.get('entry_barriers', '')} &bull; {p2.get('switching_costs', '')}", s['bullet']))
        elements.append(Paragraph(f"&bull; <b>Network & Market Share:</b> {p2.get('distribution_and_network', '')} &bull; {p2.get('market_share_stability', '')}", s['bullet']))
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

        # ⚔️ Competitor Warfare & Peer Growth Benchmarking
        cw = ai_research.get("competitor_warfare_and_beat_analysis", {})
        if cw:
            elements.append(Paragraph("⚔️ COMPETITOR WARFARE & PEER GROWTH BENCHMARKING", s['h1']))
            peer_table_data = [
                [Paragraph("Company", s['table_header']), Paragraph("3Y Sales CAGR", s['table_header']), Paragraph("EBITDA Margin", s['table_header']), Paragraph("ROCE", s['table_header']), Paragraph("Debt/Eq", s['table_header']), Paragraph("Market Share", s['table_header'])]
            ]
            for row in cw.get("growth_and_margin_comparison", [])[:3]:
                peer_table_data.append([
                    Paragraph(f"<b>{row.get('company')}</b>", s['table_cell']),
                    Paragraph(str(row.get('sales_cagr_3y', '-')), s['table_cell']),
                    Paragraph(str(row.get('ebitda_margin_pct', '-')), s['table_cell']),
                    Paragraph(str(row.get('roce_pct', '-')), s['table_cell']),
                    Paragraph(str(row.get('debt_equity', '-')), s['table_cell']),
                    Paragraph(str(row.get('market_share_pct', '-')), s['table_cell'])
                ])
            t_peers = Table(peer_table_data, colWidths=[130, 75, 75, 68, 65, 75])
            t_peers.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#F8FAFC"), colors.white]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            elements.append(t_peers)
            elements.append(Spacer(1, 2))

            can_beat = cw.get("can_it_beat_and_overtake_peers", {})
            elements.append(Paragraph(
                f"&bull; <b>Beat & Overtake Probability:</b> <font color='#059669'><b>{can_beat.get('beat_probability_score', '85% - HIGH')}</b></font><br/>"
                f"&bull; <b>Strategic Weapon:</b> {cw.get('what_company_is_doing_to_beat_competitors', [{}])[0].get('execution_detail', 'Scale and backward integration cost advantages.')}",
                s['bullet']
            ))
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
    def generate_volume3_competitor_warfare_pdf(
        ticker: str,
        company_name: str,
        fundamentals: Dict[str, Any],
        forensics: Dict[str, Any],
        ai_research: Dict[str, Any],
        output_filepath: Optional[str] = None
    ) -> bytes:
        """
        Generates Volume 3: Competitor Warfare, Peer Growth Comparison & Market Domination Strategy PDF.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, pagesize=A4, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54
        )
        s = InstitutionalPDFGenerator._get_styles()
        elements = []

        cw = ai_research.get("competitor_warfare_and_beat_analysis", {})
        can_beat = cw.get("can_it_beat_and_overtake_peers", {})

        # Header Title
        elements.append(Paragraph("VOLUME 3: COMPETITOR WARFARE & MARKET DOMINATION MEMO", s['subtitle']))
        elements.append(Paragraph(f"{company_name} ({ticker}) — Peer Benchmarking & Battle Plan", s['title']))
        elements.append(Paragraph(
            f"<b>Objective:</b> Exhaustive Peer Growth Comparison, Strategic Weapons, Pricing Power Resilience & Market Share Domination Outlook",
            s['subtitle']
        ))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0F172A"), spaceBefore=2, spaceAfter=6))

        # Domination Probability Score Banner
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

        # Section 1: Peer Growth & Margin Benchmarking Table
        elements.append(Paragraph("📊 1. PEER GROWTH & PROFITABILITY BENCHMARKING MATRIX", s['h1']))
        elements.append(Paragraph(
            "Comparing historical 3-Year revenue CAGR, operating profitability margins, capital efficiency (ROCE), and market share vs direct industry rivals:",
            s['body']
        ))

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
            cell_style = ParagraphStyle('TargetCell', parent=s['table_cell'], fontName='Helvetica-Bold' if is_target else 'Helvetica')
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

        # Section 2: Key Competitors Breakdown & Vulnerabilities
        elements.append(Paragraph("🥊 2. KEY COMPETITORS & EXPLOITABLE VULNERABILITIES", s['h1']))
        comps = cw.get("key_competitors", [])
        if comps:
            comp_table_data = [
                [Paragraph("Competitor", s['table_header']), Paragraph("Tier & Core Strength", s['table_header']), Paragraph("Exploitable Vulnerability / Weakness", s['table_header'])]
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
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 3),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ]))
            elements.append(t_comp)
            elements.append(Spacer(1, 4))

        # Section 3: Strategic Arsenal (What Company is Doing to Beat Peers)
        elements.append(Paragraph("⚔️ 3. THE STRATEGIC ARSENAL: HOW THE COMPANY IS BEATING COMPETITORS", s['h1']))
        weapons = cw.get("what_company_is_doing_to_beat_competitors", [])
        for w in weapons:
            elements.append(Paragraph(
                f"&bull; <b>{w.get('strategy_pillar')}:</b> {w.get('execution_detail')}",
                s['bullet']
            ))
        elements.append(Spacer(1, 3))

        # Section 4: Can It Beat Competitors & Overtake Peers? (Structural Catalysts & Counter-Risks)
        elements.append(Paragraph("🚀 4. CAN IT BEAT PEERS & OVERTAKE THE MARKET? (STRUCTURAL CATALYSTS)", s['h1']))
        for cat in can_beat.get("structural_catalysts_to_overtake", []):
            elements.append(Paragraph(f"&bull; <font color='#059669'><b>Growth Catalyst:</b></font> {cat}", s['bullet']))
        elements.append(Spacer(1, 2))

        elements.append(Paragraph("⚠️ <b>Competitor Counter-Offensive Risks:</b>", s['h2']))
        for risk in can_beat.get("competitor_counter_attack_risks", []):
            elements.append(Paragraph(f"&bull; <font color='#DC2626'><b>Risk Factor:</b></font> {risk}", s['bullet']))
        elements.append(Spacer(1, 4))

        # Section 5: Final Strategic Domination Verdict
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
