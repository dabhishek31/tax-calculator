import { useState } from 'react';
import { TaxComputation } from '../types/tax';
import { formatINR, formatPct } from '../utils/format';

interface Props {
  result: TaxComputation;
  isRecommended: boolean;
}

function Row({ label, value, className = '', negative = false }: { label: string; value: string; className?: string; negative?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${className}`}>
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-xs font-medium ${negative ? 'text-emerald-600' : 'text-slate-700'}`}>{value}</span>
    </div>
  );
}

export default function RegimeCard({ result, isRecommended }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isNew = result.regime === 'new';

  return (
    <div className={`rounded-xl border-2 p-5 transition-all ${
      isRecommended
        ? 'border-emerald-400 bg-emerald-50 shadow-emerald-100 shadow-md'
        : 'border-slate-200 bg-white shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              {isNew ? 'New Regime' : 'Old Regime'}
            </h3>
            {isRecommended && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                RECOMMENDED
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isNew ? 'Default · Sec 115BAC · Limited deductions' : 'Opt-in · Full deductions allowed'}
          </p>
        </div>
      </div>

      {/* Net Tax — big number */}
      <div className="mb-4 text-center py-4 bg-white/60 rounded-lg">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Net Tax Payable</p>
        <p className={`text-3xl font-bold ${isRecommended ? 'text-emerald-700' : 'text-slate-800'}`}>
          {formatINR(result.netTax)}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Effective Rate: <span className="font-semibold text-slate-600">{formatPct(result.effectiveRate)}</span>
          {' · '}Marginal: <span className="font-semibold text-slate-600">{formatPct(result.marginalRate, 0)}</span>
        </p>
      </div>

      {/* Summary rows */}
      <div className="divide-y divide-slate-100">
        <Row label="Gross Income" value={formatINR(result.grossIncome)} />
        <Row label="Total Deductions" value={`(${formatINR(result.totalDeductions)})`} negative />
        <Row label="Taxable Income" value={formatINR(result.taxableIncome)} className="font-semibold" />
        <Row label="Basic Tax" value={formatINR(result.basicTax)} />
        {result.rebate87A > 0 && <Row label="Rebate u/s 87A" value={`(${formatINR(result.rebate87A)})`} negative />}
        {result.surcharge > 0 && <Row label={`Surcharge (${formatPct(result.surchargeRate * 100, 0)})`} value={formatINR(result.surcharge)} />}
        <Row label="Cess (4%)" value={formatINR(result.cess)} />
      </div>

      {/* Expandable slab breakdown */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="mt-3 w-full text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center gap-1"
      >
        {expanded ? '▲ Hide' : '▼ Show'} slab-wise breakdown
      </button>

      {expanded && (
        <div className="mt-3 bg-white rounded-lg overflow-hidden border border-slate-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="text-left px-3 py-2 font-medium">Slab</th>
                <th className="text-right px-3 py-2 font-medium">Rate</th>
                <th className="text-right px-3 py-2 font-medium">Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {result.slabwiseTax.map((s, i) => (
                <tr key={i} className={s.tax > 0 ? 'text-slate-700' : 'text-slate-400'}>
                  <td className="px-3 py-1.5">
                    {formatINR(s.from)} – {s.to === Infinity ? 'above' : formatINR(s.to)}
                  </td>
                  <td className="px-3 py-1.5 text-right">{formatPct(s.rate * 100, 0)}</td>
                  <td className="px-3 py-1.5 text-right">{formatINR(s.tax)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Deduction breakdown for old regime */}
          {!isNew && (
            <div className="border-t border-slate-100 px-3 py-2">
              <p className="text-xs font-semibold text-slate-600 mb-1">Deduction Breakdown</p>
              {Object.entries({
                'Standard Deduction': result.deductionBreakdown.standardDeduction,
                'HRA Exemption': result.deductionBreakdown.hraExemption,
                'Section 80C': result.deductionBreakdown.section80C,
                'NPS 80CCD(1B)': result.deductionBreakdown.section80CCD1B,
                'Employer NPS': result.deductionBreakdown.employerNPS,
                '80D Self': result.deductionBreakdown.section80D_self,
                '80D Parents': result.deductionBreakdown.section80D_parents,
                'Home Loan 24(b)': result.deductionBreakdown.homeLoanInterest,
                '80TTA/TTB': result.deductionBreakdown.section80TTA_or_TTB,
                'Other': result.deductionBreakdown.otherDeductions,
              }).filter(([, v]) => v > 0).map(([label, value]) => (
                <div key={label} className="flex justify-between text-xs py-0.5">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-emerald-600 font-medium">{formatINR(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
