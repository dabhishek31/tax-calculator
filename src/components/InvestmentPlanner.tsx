
import { InvestmentSuggestion } from '../types/tax';
import { formatINR } from '../utils/format';

interface Props {
  suggestions: InvestmentSuggestion[];
  oldRegimeTax?: number;
}

function ProgressBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  const full = pct >= 100;
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 mt-1.5">
      <div
        className={`h-2 rounded-full transition-all ${full ? 'bg-emerald-500' : 'bg-indigo-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function InvestmentPlanner({ suggestions }: Props) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <span className="bg-amber-100 text-amber-600 rounded-lg p-1.5 text-sm">💡</span>
          Investment Optimizer
        </h2>
        <p className="text-sm text-slate-500 text-center py-4">
          All deductions maximized! You are tax-optimized under the Old Regime.
        </p>
      </div>
    );
  }

  const totalPotentialSaving = suggestions.reduce((a, s) => a + s.potentialTaxSaving, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
        <span className="bg-amber-100 text-amber-600 rounded-lg p-1.5 text-sm">💡</span>
        Investment Optimizer
      </h2>
      <p className="text-xs text-slate-500 mb-1">
        Under <span className="font-semibold text-slate-600">Old Regime</span> — maximize these to reduce your tax liability.
      </p>

      {totalPotentialSaving > 0 && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-700 font-medium">Total additional savings possible</p>
            <p className="text-xs text-emerald-600 opacity-80">by maximizing all deductions below</p>
          </div>
          <p className="text-xl font-bold text-emerald-700">{formatINR(totalPotentialSaving)}</p>
        </div>
      )}

      <div className="space-y-4">
        {suggestions.map(s => {
          const utilized = s.maxLimit > 0 ? (s.currentAmount / s.maxLimit) * 100 : 0;
          return (
            <div key={s.section} className="border border-slate-100 rounded-lg p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {s.section}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{s.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{s.description}</p>
                </div>
                {s.potentialTaxSaving > 0 && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400">Save</p>
                    <p className="text-sm font-bold text-emerald-600">{formatINR(s.potentialTaxSaving)}</p>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Invested: <span className="font-semibold text-slate-700">{formatINR(s.currentAmount)}</span></span>
                  <span>Limit: <span className="font-semibold text-slate-700">{formatINR(s.maxLimit)}</span></span>
                </div>
                <ProgressBar current={s.currentAmount} max={s.maxLimit} />
                <p className="text-xs text-amber-600 font-medium mt-1">
                  ↑ Invest {formatINR(s.remainingRoom)} more · save {formatINR(s.potentialTaxSaving)} in tax
                </p>
                <p className="text-xs text-slate-400">({Math.round(utilized)}% of limit utilized)</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
