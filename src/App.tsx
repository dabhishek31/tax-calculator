
import { useTaxCalculator } from './hooks/useTaxCalculator';
import Header from './components/Header';
import ProfileCard from './components/ProfileCard';
import IncomeCard from './components/IncomeCard';
import DeductionsCard from './components/DeductionsCard';
import ResultsPanel from './components/ResultsPanel';

export default function App() {
  const { input, update, config, result, suggestions, hraOptimization } = useTaxCalculator();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header selectedYear={input.taxYear} onYearChange={year => update({ taxYear: year })} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* ── Left: Input Panel ─── */}
          <div className="lg:col-span-2 space-y-4">
            <ProfileCard input={input} update={update} />
            <IncomeCard input={input} update={update} />
            {config && (
              <DeductionsCard input={input} update={update} config={config} />
            )}
          </div>

          {/* ── Right: Results Panel (sticky) ─── */}
          <div className="lg:col-span-3 lg:sticky lg:top-4">
            <ResultsPanel result={result} suggestions={suggestions} hraOptimization={hraOptimization} input={input} />
          </div>

        </div>
      </main>
    </div>
  );
}
