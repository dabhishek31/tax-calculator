
import { ComparisonResult, InvestmentSuggestion, HRAOptimizationResult, TaxInput } from '../types/tax';
import { formatINR } from '../utils/format';
import RegimeCard from './RegimeCard';
import InvestmentPlanner from './InvestmentPlanner';
import HRAOptimizer from './HRAOptimizer';
import DownloadButton from './DownloadButton';

interface Props {
  result: ComparisonResult | null;
  suggestions: InvestmentSuggestion[];
  hraOptimization: HRAOptimizationResult | null;
  input: TaxInput;
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center">
      <div className="text-5xl mb-4">🧮</div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">Enter your income to get started</h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        Fill in your gross salary on the left. The calculator will instantly show your tax under both regimes.
      </p>
    </div>
  );
}

export default function ResultsPanel({ result, suggestions, hraOptimization, input }: Props) {
  const hasHRAData = hraOptimization?.hasHRAData ?? false;

  // Show empty state only if no income AND no HRA data entered
  if (!result && !hasHRAData) return <EmptyState />;

  return (
    <div className="space-y-4">

      {/* ── Tax Comparison (only when income is entered) ── */}
      {result && (() => {
        const { newRegime, oldRegime, betterRegime, saving } = result;
        const isNew = betterRegime === 'new';
        return (
          <>
            {/* Download Button */}
            <div className="flex justify-end">
              <DownloadButton data={{ input, result, hraOptimization, suggestions }} />
            </div>

            {/* Recommendation Banner */}
            <div className={`rounded-xl p-4 flex items-center justify-between gap-3 ${
              saving === 0
                ? 'bg-slate-100 border border-slate-200'
                : isNew
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
            }`}>
              <div>
                {saving === 0 ? (
                  <p className="text-sm font-semibold text-slate-700">
                    Both regimes result in the same tax — choose New Regime for simplicity.
                  </p>
                ) : (
                  <>
                    <p className="text-xs opacity-80 uppercase tracking-wide font-medium">
                      {isNew ? 'New Regime' : 'Old Regime'} saves you
                    </p>
                    <p className="text-2xl font-bold">
                      {formatINR(saving)} <span className="text-base font-normal opacity-90">this year</span>
                    </p>
                  </>
                )}
              </div>
              {saving > 0 && (
                <div className="flex-shrink-0 bg-white/20 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs opacity-80">Choose</p>
                  <p className="text-sm font-bold">{isNew ? 'New' : 'Old'} Regime</p>
                </div>
              )}
            </div>

            {/* Side-by-side regime cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <RegimeCard result={newRegime} isRecommended={betterRegime === 'new'} />
              <RegimeCard result={oldRegime} isRecommended={betterRegime === 'old'} />
            </div>

            {/* Monthly TDS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Monthly TDS (Approximate)</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'New Regime', tax: newRegime.netTax, recommended: betterRegime === 'new' },
                  { label: 'Old Regime', tax: oldRegime.netTax, recommended: betterRegime === 'old' },
                ].map(r => (
                  <div key={r.label} className={`rounded-lg p-3 text-center ${r.recommended ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-100'}`}>
                    <p className="text-xs text-slate-500">{r.label}</p>
                    <p className={`text-lg font-bold ${r.recommended ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {formatINR(Math.round(r.tax / 12))}
                      <span className="text-xs font-normal text-slate-400">/mo</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Planner */}
            <InvestmentPlanner suggestions={suggestions} oldRegimeTax={oldRegime.netTax} />
          </>
        );
      })()}

      {/* ── HRA Optimizer (shows whenever HRA data is present) ── */}
      {hraOptimization && (
        <HRAOptimizer optimization={hraOptimization} />
      )}

      {/* Disclaimer */}
      {(result || hasHRAData) && (
        <p className="text-xs text-slate-400 text-center px-4">
          Calculations are indicative. Consult a CA for tax planning.
          Based on Income Tax Act 2025 effective 1 Apr 2026 · Surcharge marginal relief not computed.
        </p>
      )}
    </div>
  );
}
