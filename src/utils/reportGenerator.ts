import jsPDF from 'jspdf';
import {
  ComparisonResult, TaxInput, HRAOptimizationResult, InvestmentSuggestion,
} from '../types/tax';
import { formatNum, formatPct } from './format';

export interface ReportData {
  input: TaxInput;
  result: ComparisonResult;
  hraOptimization: HRAOptimizationResult | null;
  suggestions: InvestmentSuggestion[];
}

// Use "Rs." — default jsPDF fonts don't embed the ₹ glyph (U+20B9)
function rs(amount: number): string {
  return `Rs. ${formatNum(amount)}`;
}

function taxpayerLabel(input: TaxInput) {
  return input.taxpayerType === 'superSenior' ? 'Super Senior Citizen (80+)'
    : input.taxpayerType === 'senior' ? 'Senior Citizen (60–79)'
    : 'Individual (Below 60)';
}

// ─── PDF Generator ───────────────────────────────────────────────────────────
export function downloadPDF(data: ReportData): void {
  const { input, result, hraOptimization, suggestions } = data;
  const { newRegime, oldRegime, betterRegime, saving } = result;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210; // page width
  const ML = 18;  // margin left
  const MR = 18;  // margin right
  const CW = PW - ML - MR; // content width = 174mm
  const RIGHT = PW - MR;   // right edge = 192
  const COL2 = ML + CW * 0.52; // New Regime column right edge ~109
  const COL3 = RIGHT;           // Old Regime column right edge 192

  let y = 0;

  function checkY(need = 10) {
    if (y + need > 282) {
      doc.addPage();
      y = 16;
      // repeat thin header line on continuation pages
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, PW, 8, 'F');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(199, 210, 254);
      doc.text(`India Tax Calculator Report  |  FY ${input.taxYear}`, ML, 5.5);
      doc.setTextColor(30, 41, 59);
      y = 14;
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function secHeader(title: string) {
    checkY(12);
    doc.setFillColor(79, 70, 229);
    doc.rect(ML, y, CW, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), ML + 3, y + 5.5);
    doc.setTextColor(30, 41, 59);
    y += 11;
  }

  function subHeader(title: string) {
    checkY(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(79, 70, 229);
    doc.text(title, ML, y);
    y += 3;
    doc.setDrawColor(199, 210, 254);
    doc.line(ML, y, RIGHT, y);
    y += 4;
    doc.setTextColor(30, 41, 59);
  }

  let rowAlt = false;
  function tableRow(label: string, value: string, bold = false, indent = 0) {
    checkY(6.5);
    if (rowAlt) {
      doc.setFillColor(248, 250, 252);
      doc.rect(ML, y - 4, CW, 5.5, 'F');
    }
    rowAlt = !rowAlt;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(bold ? 15 : 71, bold ? 23 : 85, bold ? 42 : 105);
    doc.text(label, ML + indent, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(value, RIGHT, y, { align: 'right' });
    y += 5.5;
  }

  let cmpAlt = false;
  function cmpRow(label: string, v1: string, v2: string, bold = false, isRec1 = false, isRec2 = false) {
    checkY(6.5);
    if (cmpAlt) {
      doc.setFillColor(248, 250, 252);
      doc.rect(ML, y - 4, CW, 5.5, 'F');
    }
    cmpAlt = !cmpAlt;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(bold ? 15 : 100, bold ? 23 : 116, bold ? 42 : 139);
    doc.text(label, ML, y);
    // col1
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isRec1 ? 5 : 15, isRec1 ? 150 : 23, isRec1 ? 105 : 42);
    doc.text(v1, COL2, y, { align: 'right' });
    // col2
    doc.setTextColor(isRec2 ? 5 : 15, isRec2 ? 150 : 23, isRec2 ? 105 : 42);
    doc.text(v2, COL3, y, { align: 'right' });
    y += 5.5;
  }

  function gap(h = 4) { y += h; }
  function divider() {
    doc.setDrawColor(226, 232, 240);
    doc.line(ML, y, RIGHT, y);
    y += 3;
  }

  // ── Cover Header ─────────────────────────────────────────────────────────
  doc.setFillColor(55, 48, 163);
  doc.rect(0, 0, PW, 38, 'F');
  // accent strip
  doc.setFillColor(139, 92, 246);
  doc.rect(0, 34, PW, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('India Tax Calculator Report', ML, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(196, 181, 253);
  doc.text(`Financial Year ${input.taxYear}  (AY ${nextAY(input.taxYear)})`, ML, 24);

  doc.setFontSize(8.5);
  doc.setTextColor(167, 139, 250);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}  ·  Based on Income Tax Act 2025`, ML, 30);

  doc.setTextColor(30, 41, 59);
  y = 46;

  // ── Profile ───────────────────────────────────────────────────────────────
  secHeader('Taxpayer Profile & Income');
  rowAlt = false;
  tableRow('Age Category', taxpayerLabel(input));
  tableRow('Employment Type', input.employmentType === 'salaried' ? 'Salaried (Standard Deduction applicable)' : 'Business / Self-Employed');
  if (input.grossSalary > 0) tableRow('Gross Salary / Income', rs(input.grossSalary));
  if (input.basicSalary > 0) tableRow('Basic Salary', rs(input.basicSalary));
  if (input.hraReceived > 0) tableRow('HRA Received', rs(input.hraReceived));
  if (input.otherIncome > 0) tableRow('Other Income', rs(input.otherIncome));
  if (input.rentalIncome > 0) tableRow('Rental Income', rs(input.rentalIncome));
  gap(1);
  divider();
  tableRow('TOTAL GROSS INCOME', rs(newRegime.grossIncome), true);
  gap();

  // ── Recommendation ────────────────────────────────────────────────────────
  secHeader('Recommendation');
  checkY(18);
  const isNew = betterRegime === 'new';
  const recBg = isNew ? [79, 70, 229] : [5, 150, 105];
  doc.setFillColor(recBg[0], recBg[1], recBg[2]);
  doc.roundedRect(ML, y, CW, 16, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  if (saving > 0) {
    doc.text(`RECOMMENDED: ${isNew ? 'NEW' : 'OLD'} REGIME`, PW / 2, y + 7, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(220, 252, 231);
    doc.text(`You save  ${rs(saving)}  per year compared to the other regime`, PW / 2, y + 13, { align: 'center' });
  } else {
    doc.setFontSize(10);
    doc.text('Both regimes result in equal tax', PW / 2, y + 10, { align: 'center' });
  }
  doc.setTextColor(30, 41, 59);
  y += 20;

  // ── Comparison Table ──────────────────────────────────────────────────────
  secHeader('Regime Comparison');

  // Column headers
  checkY(8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('', ML, y); // label col empty
  doc.setTextColor(isNew ? 5 : 100, isNew ? 150 : 116, isNew ? 105 : 139);
  doc.text(`NEW REGIME${isNew ? ' \u2605' : ''}`, COL2, y, { align: 'right' });
  doc.setTextColor(!isNew ? 5 : 100, !isNew ? 150 : 116, !isNew ? 105 : 139);
  doc.text(`OLD REGIME${!isNew ? ' \u2605' : ''}`, COL3, y, { align: 'right' });
  doc.setTextColor(30, 41, 59);
  y += 4;
  divider();
  cmpAlt = false;

  cmpRow('Gross Income', rs(newRegime.grossIncome), rs(oldRegime.grossIncome));
  cmpRow('Total Deductions', `(${rs(newRegime.totalDeductions)})`, `(${rs(oldRegime.totalDeductions)})`);
  cmpRow('Taxable Income', rs(newRegime.taxableIncome), rs(oldRegime.taxableIncome));
  gap(1); divider();
  cmpRow('Basic Tax on Slabs', rs(newRegime.basicTax), rs(oldRegime.basicTax));
  if (newRegime.rebate87A > 0 || oldRegime.rebate87A > 0)
    cmpRow('Rebate u/s 87A', newRegime.rebate87A > 0 ? `(${rs(newRegime.rebate87A)})` : '\u2014', oldRegime.rebate87A > 0 ? `(${rs(oldRegime.rebate87A)})` : '\u2014');
  cmpRow('Tax after Rebate', rs(newRegime.taxAfterRebate), rs(oldRegime.taxAfterRebate));
  if (newRegime.surcharge > 0 || oldRegime.surcharge > 0)
    cmpRow(`Surcharge`, rs(newRegime.surcharge), rs(oldRegime.surcharge));
  cmpRow('Health & Education Cess (4%)', rs(newRegime.cess), rs(oldRegime.cess));
  gap(1); divider();
  cmpRow('NET TAX PAYABLE', rs(newRegime.netTax), rs(oldRegime.netTax), true, isNew, !isNew);
  cmpRow('Effective Tax Rate', formatPct(newRegime.effectiveRate), formatPct(oldRegime.effectiveRate));
  cmpRow('Marginal Slab Rate', formatPct(newRegime.marginalRate, 0), formatPct(oldRegime.marginalRate, 0));
  cmpRow('Monthly TDS (approx.)', rs(Math.round(newRegime.netTax / 12)), rs(Math.round(oldRegime.netTax / 12)));
  gap();

  // ── New Regime Breakdown ──────────────────────────────────────────────────
  secHeader('New Regime — Detailed Breakdown');
  subHeader('Deductions Applied');
  rowAlt = false;
  tableRow('Standard Deduction (Salaried)', rs(newRegime.deductionBreakdown.standardDeduction));
  if (newRegime.deductionBreakdown.employerNPS > 0)
    tableRow('Employer NPS — Sec 80CCD(2)', rs(newRegime.deductionBreakdown.employerNPS));
  tableRow('Total Deductions', rs(newRegime.totalDeductions), true);
  gap(2);

  subHeader('Slab-wise Tax Computation');
  rowAlt = false;
  newRegime.slabwiseTax.forEach(s => {
    const label = `${rs(s.from)}  to  ${s.to === Infinity ? 'above' : rs(s.to)}  @  ${formatPct(s.rate * 100, 0)}`;
    tableRow(label, rs(s.tax), false, 3);
  });
  divider();
  tableRow('Total Basic Tax', rs(newRegime.basicTax), true);
  if (newRegime.rebate87A > 0) tableRow('Less: Rebate u/s 87A', `(${rs(newRegime.rebate87A)})`);
  tableRow('Tax after Rebate', rs(newRegime.taxAfterRebate), true);
  if (newRegime.surcharge > 0) tableRow(`Surcharge @ ${formatPct(newRegime.surchargeRate * 100, 0)}`, rs(newRegime.surcharge));
  tableRow('Health & Education Cess (4%)', rs(newRegime.cess));
  divider();
  tableRow('NET TAX PAYABLE', rs(newRegime.netTax), true);
  gap();

  // ── Old Regime Breakdown ───────────────────────────────────────────────────
  secHeader('Old Regime — Detailed Breakdown');
  subHeader('Deductions Applied');
  rowAlt = false;
  const deductionRows: [string, number][] = [
    ['Standard Deduction (Salaried)', oldRegime.deductionBreakdown.standardDeduction],
    ['HRA Exemption — Sec 10(13A)', oldRegime.deductionBreakdown.hraExemption],
    ['Section 80C (PPF/ELSS/LIC/etc.)', oldRegime.deductionBreakdown.section80C],
    ['NPS Self Contribution — Sec 80CCD(1B)', oldRegime.deductionBreakdown.section80CCD1B],
    ['Employer NPS — Sec 80CCD(2)', oldRegime.deductionBreakdown.employerNPS],
    ['Health Insurance Self — Sec 80D', oldRegime.deductionBreakdown.section80D_self],
    ['Health Insurance Parents — Sec 80D', oldRegime.deductionBreakdown.section80D_parents],
    ['Home Loan Interest — Sec 24(b)', oldRegime.deductionBreakdown.homeLoanInterest],
    ['Savings Interest — Sec 80TTA/TTB', oldRegime.deductionBreakdown.section80TTA_or_TTB],
    ['Other Deductions (80E/80G/etc.)', oldRegime.deductionBreakdown.otherDeductions],
  ];
  deductionRows.filter(([, v]) => v > 0).forEach(([label, val]) => tableRow(label, rs(val), false, 3));
  divider();
  tableRow('Total Deductions', rs(oldRegime.totalDeductions), true);
  gap(2);

  subHeader('Slab-wise Tax Computation');
  rowAlt = false;
  oldRegime.slabwiseTax.forEach(s => {
    const label = `${rs(s.from)}  to  ${s.to === Infinity ? 'above' : rs(s.to)}  @  ${formatPct(s.rate * 100, 0)}`;
    tableRow(label, rs(s.tax), false, 3);
  });
  divider();
  tableRow('Total Basic Tax', rs(oldRegime.basicTax), true);
  if (oldRegime.rebate87A > 0) tableRow('Less: Rebate u/s 87A', `(${rs(oldRegime.rebate87A)})`);
  tableRow('Tax after Rebate', rs(oldRegime.taxAfterRebate), true);
  if (oldRegime.surcharge > 0) tableRow(`Surcharge @ ${formatPct(oldRegime.surchargeRate * 100, 0)}`, rs(oldRegime.surcharge));
  tableRow('Health & Education Cess (4%)', rs(oldRegime.cess));
  divider();
  tableRow('NET TAX PAYABLE', rs(oldRegime.netTax), true);
  gap();

  // ── HRA Optimizer ──────────────────────────────────────────────────────────
  if (hraOptimization?.hasHRAData) {
    const h = hraOptimization;
    secHeader('HRA Optimizer');
    rowAlt = false;
    subHeader('Your HRA Profile');
    tableRow('HRA Received from Employer', rs(h.hraReceived));
    tableRow('Basic Salary', rs(h.basicSalary));
    tableRow('City Rate', formatPct(h.cityPct * 100, 0) + (h.cityPct === 0.5 ? ' (Metro)' : ' (Non-Metro)'));
    tableRow('Current Rent Paid (Annual)', rs(h.currentRentPaid));
    gap(2);

    subHeader('3-Condition Analysis (Exemption = Minimum of all 3)');
    rowAlt = false;
    tableRow('Condition 1 — HRA Received', rs(h.condition1_hraReceived));
    tableRow(`Condition 2 — City Cap (${formatPct(h.cityPct * 100, 0)} \u00d7 Basic)`, rs(h.condition2_cityCap));
    tableRow('Condition 3 — Rent Paid \u2212 10% of Basic', rs(Math.max(0, h.condition3_rentMinus10pct)));
    divider();
    tableRow('Current HRA Exemption (binding constraint)', rs(h.currentExemption), true);
    tableRow('Maximum Achievable Exemption', rs(h.maxAchievableExemption), true);
    if (h.hraPermanentlyTaxable > 0)
      tableRow('HRA Permanently Taxable (exceeds city cap)', rs(h.hraPermanentlyTaxable));
    gap(2);

    if (!h.isFullyUtilized) {
      subHeader('Optimization Recommendation');
      rowAlt = false;
      tableRow('Recommended Annual Rent', rs(h.optimalAnnualRent), true);
      tableRow('Recommended Monthly Rent', rs(h.optimalMonthlyRent), true);
      tableRow('Additional Rent to Pay Monthly', rs(h.additionalMonthlyRent));
      tableRow('Additional Tax Saving by Optimizing', rs(h.additionalTaxSaving), true);
      if (h.requiresLandlordPAN)
        tableRow('Landlord PAN Required?', 'YES — Annual rent exceeds Rs. 1,00,000');
    } else {
      gap(2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105);
      doc.text('\u2713  HRA is FULLY OPTIMIZED — maximum exemption is being claimed', ML + 3, y);
      doc.setTextColor(30, 41, 59);
      y += 6;
    }
    gap();
  }

  // ── Investment Suggestions ─────────────────────────────────────────────────
  if (suggestions.length > 0) {
    secHeader('Investment Optimizer (Old Regime)');
    const totalSaving = suggestions.reduce((a, s) => a + s.potentialTaxSaving, 0);
    if (totalSaving > 0) {
      checkY(12);
      doc.setFillColor(236, 253, 245);
      doc.rect(ML, y, CW, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105);
      doc.text('Total additional tax savings possible by maximizing all deductions below:', ML + 3, y + 4.5);
      doc.setFontSize(11);
      doc.text(rs(totalSaving), RIGHT - 3, y + 4.5, { align: 'right' });
      doc.setTextColor(30, 41, 59);
      y += 13;
    }
    suggestions.forEach((s, i) => {
      checkY(22);
      if (i > 0) gap(2);
      subHeader(`${s.section} — ${s.label}`);
      rowAlt = false;
      tableRow('Currently Invested', rs(s.currentAmount));
      tableRow('Maximum Limit', rs(s.maxLimit));
      tableRow('Remaining Room to Invest', rs(s.remainingRoom));
      tableRow('Potential Tax Saving (if maximized)', rs(s.potentialTaxSaving), true);
    });
    gap();
  }

  // ── Footer / Disclaimer ────────────────────────────────────────────────────
  checkY(22);
  gap(3);
  doc.setFillColor(248, 250, 252);
  doc.rect(ML, y, CW, 18, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(ML, y, CW, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DISCLAIMER: All calculations are indicative estimates for planning purposes only.', ML + 3, y + 5);
  doc.text('Consult a qualified Chartered Accountant before making investment or tax decisions.', ML + 3, y + 9.5);
  doc.text('Based on Income Tax Act 2025 (effective 1 Apr 2026). Surcharge marginal relief not computed.', ML + 3, y + 14);

  // Page numbers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${p} of ${totalPages}  |  India Tax Calculator  |  FY ${input.taxYear}`, PW / 2, 291, { align: 'center' });
  }

  doc.save(`tax-report-fy${input.taxYear.replace('-', '_')}.pdf`);
}

function nextAY(fy: string): string {
  const parts = fy.split('-');
  if (parts.length !== 2) return '';
  const end = parseInt(parts[1]);
  return `${end}-${end + 1}`;
}

// ─── Markdown Generator ───────────────────────────────────────────────────────
export function downloadMarkdown(data: ReportData): void {
  const { input, result, hraOptimization, suggestions } = data;
  const { newRegime, oldRegime, betterRegime, saving } = result;
  const isNew = betterRegime === 'new';

  function inr(n: number) { return `₹${formatNum(n)}`; }
  function bold(s: string) { return `**${s}**`; }

  const lines: string[] = [];
  const add = (...l: string[]) => lines.push(...l);

  add(
    `# 🇮🇳 India Tax Calculator Report`,
    ``,
    `**Financial Year:** ${input.taxYear} (AY ${nextAY(input.taxYear)})  `,
    `**Generated:** ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}  `,
    `**Based on:** Income Tax Act 2025 (effective 1 April 2026)`,
    ``,
    `---`,
    ``,
  );

  // Profile
  add(
    `## 👤 Taxpayer Profile`,
    ``,
    `| Field | Value |`,
    `|---|---|`,
    `| Age Category | ${taxpayerLabel(input)} |`,
    `| Employment Type | ${input.employmentType === 'salaried' ? 'Salaried' : 'Business / Self-Employed'} |`,
    `| Financial Year | FY ${input.taxYear} |`,
    ``,
  );

  // Income
  add(`## 💰 Income Summary`, ``, `| Source | Amount |`, `|---|---|`);
  if (input.grossSalary > 0) add(`| Gross Salary / Income | ${inr(input.grossSalary)} |`);
  if (input.basicSalary > 0) add(`| Basic Salary | ${inr(input.basicSalary)} |`);
  if (input.hraReceived > 0) add(`| HRA Received | ${inr(input.hraReceived)} |`);
  if (input.otherIncome > 0) add(`| Other Income | ${inr(input.otherIncome)} |`);
  if (input.rentalIncome > 0) add(`| Rental Income | ${inr(input.rentalIncome)} |`);
  add(`| ${bold('Total Gross Income')} | ${bold(inr(newRegime.grossIncome))} |`, ``);

  // Recommendation
  add(`## ⭐ Recommendation`, ``);
  if (saving > 0) {
    add(
      `> ### ${isNew ? '🟣 NEW REGIME RECOMMENDED' : '🟢 OLD REGIME RECOMMENDED'}`,
      `> **You save ${inr(saving)} per year** compared to the other regime.`,
      ``,
    );
  } else {
    add(`> Both regimes result in equal tax. Choose **New Regime** for simplicity.`, ``);
  }

  // Comparison
  add(
    `## 📊 Regime Comparison`,
    ``,
    `| Metric | New Regime${isNew ? ' ★' : ''} | Old Regime${!isNew ? ' ★' : ''} |`,
    `|---|---|---|`,
    `| Gross Income | ${inr(newRegime.grossIncome)} | ${inr(oldRegime.grossIncome)} |`,
    `| Total Deductions | (${inr(newRegime.totalDeductions)}) | (${inr(oldRegime.totalDeductions)}) |`,
    `| Taxable Income | ${inr(newRegime.taxableIncome)} | ${inr(oldRegime.taxableIncome)} |`,
    `| Basic Tax | ${inr(newRegime.basicTax)} | ${inr(oldRegime.basicTax)} |`,
    `| Rebate u/s 87A | ${newRegime.rebate87A > 0 ? `(${inr(newRegime.rebate87A)})` : '—'} | ${oldRegime.rebate87A > 0 ? `(${inr(oldRegime.rebate87A)})` : '—'} |`,
    `| Surcharge | ${inr(newRegime.surcharge)} | ${inr(oldRegime.surcharge)} |`,
    `| Health & Ed. Cess (4%) | ${inr(newRegime.cess)} | ${inr(oldRegime.cess)} |`,
    `| ${bold('Net Tax Payable')} | ${bold(inr(newRegime.netTax))} | ${bold(inr(oldRegime.netTax))} |`,
    `| Effective Rate | ${formatPct(newRegime.effectiveRate)} | ${formatPct(oldRegime.effectiveRate)} |`,
    `| Marginal Slab | ${formatPct(newRegime.marginalRate, 0)} | ${formatPct(oldRegime.marginalRate, 0)} |`,
    `| Monthly TDS (approx.) | ${inr(Math.round(newRegime.netTax / 12))} | ${inr(Math.round(oldRegime.netTax / 12))} |`,
    ``,
  );

  // New Regime breakdown
  add(`## 🟣 New Regime — Detailed Breakdown`, ``);
  add(`### Deductions`, ``, `| Deduction | Amount |`, `|---|---|`);
  add(`| Standard Deduction | ${inr(newRegime.deductionBreakdown.standardDeduction)} |`);
  if (newRegime.deductionBreakdown.employerNPS > 0)
    add(`| Employer NPS — Sec 80CCD(2) | ${inr(newRegime.deductionBreakdown.employerNPS)} |`);
  add(`| ${bold('Total')} | ${bold(inr(newRegime.totalDeductions))} |`, ``);

  add(`### Slab-wise Tax`, ``, `| Income Slab | Rate | Tax |`, `|---|---|---|`);
  newRegime.slabwiseTax.forEach(s => {
    add(`| ${inr(s.from)} – ${s.to === Infinity ? 'above' : inr(s.to)} | ${formatPct(s.rate * 100, 0)} | ${inr(s.tax)} |`);
  });
  add(``, `| | ${bold('Net Tax Payable')} | ${bold(inr(newRegime.netTax))} |`, ``);

  // Old Regime breakdown
  add(`## 🟢 Old Regime — Detailed Breakdown`, ``);
  add(`### Deductions`, ``, `| Section | Deduction | Amount |`, `|---|---|---|`);
  const dedMap: [string, string, number][] = [
    ['Standard Deduction', 'Salaried / Pensioner', oldRegime.deductionBreakdown.standardDeduction],
    ['Sec 10(13A)', 'HRA Exemption', oldRegime.deductionBreakdown.hraExemption],
    ['Sec 80C', 'PPF / ELSS / LIC / Tuition / Home Loan Principal', oldRegime.deductionBreakdown.section80C],
    ['Sec 80CCD(1B)', 'NPS Self Contribution', oldRegime.deductionBreakdown.section80CCD1B],
    ['Sec 80CCD(2)', 'Employer NPS', oldRegime.deductionBreakdown.employerNPS],
    ['Sec 80D (Self)', 'Health Insurance — Self & Family', oldRegime.deductionBreakdown.section80D_self],
    ['Sec 80D (Parents)', 'Health Insurance — Parents', oldRegime.deductionBreakdown.section80D_parents],
    ['Sec 24(b)', 'Home Loan Interest (Self-Occupied)', oldRegime.deductionBreakdown.homeLoanInterest],
    ['Sec 80TTA/TTB', 'Savings / FD Interest', oldRegime.deductionBreakdown.section80TTA_or_TTB],
    ['Others', '80E / 80G / Other', oldRegime.deductionBreakdown.otherDeductions],
  ];
  dedMap.filter(([,, v]) => v > 0).forEach(([sec, label, val]) => add(`| ${sec} | ${label} | ${inr(val)} |`));
  add(`| | ${bold('Total Deductions')} | ${bold(inr(oldRegime.totalDeductions))} |`, ``);

  add(`### Slab-wise Tax`, ``, `| Income Slab | Rate | Tax |`, `|---|---|---|`);
  oldRegime.slabwiseTax.forEach(s => {
    add(`| ${inr(s.from)} – ${s.to === Infinity ? 'above' : inr(s.to)} | ${formatPct(s.rate * 100, 0)} | ${inr(s.tax)} |`);
  });
  add(``, `| | ${bold('Net Tax Payable')} | ${bold(inr(oldRegime.netTax))} |`, ``);

  // HRA Optimizer
  if (hraOptimization?.hasHRAData) {
    const h = hraOptimization;
    add(
      `## 🏠 HRA Optimizer`,
      ``,
      `> **FY 2026-27:** 8 cities now qualify for 50% HRA exemption — Bengaluru, Hyderabad, Pune & Ahmedabad newly added from 1 Apr 2026.`,
      ``,
      `### Your HRA Profile`,
      ``,
      `| Field | Value |`,
      `|---|---|`,
      `| HRA Received | ${inr(h.hraReceived)} |`,
      `| Basic Salary | ${inr(h.basicSalary)} |`,
      `| City Rate | ${formatPct(h.cityPct * 100, 0)} (${h.cityPct === 0.5 ? 'Metro' : 'Non-Metro'}) |`,
      `| Current Rent Paid | ${inr(h.currentRentPaid)} / year |`,
      ``,
      `### 3-Condition Analysis`,
      ``,
      `| Condition | Formula | Value |`,
      `|---|---|---|`,
      `| 1 | HRA Received from Employer | ${inr(h.condition1_hraReceived)} |`,
      `| 2 | ${formatPct(h.cityPct * 100, 0)} × Basic Salary | ${inr(h.condition2_cityCap)} |`,
      `| 3 | Rent Paid − 10% of Basic | ${inr(Math.max(0, h.condition3_rentMinus10pct))} |`,
      `| | **Current Exemption (minimum of above)** | **${inr(h.currentExemption)}** |`,
      `| | **Maximum Achievable Exemption** | **${inr(h.maxAchievableExemption)}** |`,
      ``,
    );
    if (!h.isFullyUtilized) {
      add(
        `### ✅ Optimization Recommendation`,
        ``,
        `| | |`,
        `|---|---|`,
        `| **Recommended Monthly Rent** | **${inr(h.optimalMonthlyRent)}** |`,
        `| Recommended Annual Rent | ${inr(h.optimalAnnualRent)} |`,
        `| Additional Rent Needed Monthly | ${inr(h.additionalMonthlyRent)} |`,
        `| **Additional Tax Saving** | **${inr(h.additionalTaxSaving)}** |`,
        h.requiresLandlordPAN ? `| ⚠️ Landlord PAN | **Required** (rent > ₹1L/year) |` : '',
        ``,
      );
    } else {
      add(`### ✅ HRA is Fully Optimized`, ``, `You are paying the right rent and claiming the maximum possible HRA exemption of **${inr(h.maxAchievableExemption)}**.`, ``);
    }
    if (h.hraPermanentlyTaxable > 0) {
      add(`> ⚠️ **${inr(h.hraPermanentlyTaxable)}** of your HRA is permanently taxable regardless of rent paid — your employer gives more HRA than the city cap allows.`, ``);
    }
  }

  // Investment Suggestions
  if (suggestions.length > 0) {
    const totalSaving = suggestions.reduce((a, s) => a + s.potentialTaxSaving, 0);
    add(
      `## 💡 Investment Optimizer (Old Regime)`,
      ``,
      `> **Total additional tax savings possible:** **${inr(totalSaving)}** by maximizing all deductions below.`,
      ``,
      `| Section | Investment | Invested | Limit | Room Left | Tax Saving |`,
      `|---|---|---|---|---|---|`,
    );
    suggestions.forEach(s => {
      add(`| ${s.section} | ${s.label} | ${inr(s.currentAmount)} | ${inr(s.maxLimit)} | ${inr(s.remainingRoom)} | **${inr(s.potentialTaxSaving)}** |`);
    });
    add(``);
  }

  // Disclaimer
  add(
    `---`,
    ``,
    `> **Disclaimer:** Calculations are indicative estimates for planning purposes only. Consult a qualified Chartered Accountant before making investment or tax decisions. Based on Income Tax Act 2025 effective 1 April 2026. Surcharge marginal relief not computed.`,
    ``,
    `*Generated by India Tax Calculator*`,
  );

  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tax-report-fy${input.taxYear.replace('-', '_')}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
