import { useTaxCalculator } from '../hooks/useTaxCalculator';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import IncomeCard from '../components/IncomeCard';
import DeductionsCard from '../components/DeductionsCard';
import ResultsPanel from '../components/ResultsPanel';
import HomePageContent from '../components/HomePageContent';

export default function HomePage() {
  const { input, update, config, result, suggestions, hraOptimization } = useTaxCalculator();

  return (
    <>
      <SEOHead
        title="Income Tax Calculator India FY 2026-27 | New vs Old Regime"
        description="Free Indian income tax calculator for FY 2026-27 (AY 2027-28). Compare New vs Old regime instantly. Includes 80C, 80D, HRA, NPS deductions, investment optimizer. Based on Income Tax Act 2025."
        path="/"
      />

      <Header selectedYear={input.taxYear} onYearChange={year => update({ taxYear: year })} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" role="main" id="calculator">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Free Income Tax Calculator India — FY 2026-27</h1>
        <p className="text-slate-500 text-sm mb-5">Compare New Regime vs Old Regime instantly. Based on Income Tax Act 2025.</p>

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

      {/* SEO Content Below the Fold */}
      <HomePageContent />
    </>
  );
}
