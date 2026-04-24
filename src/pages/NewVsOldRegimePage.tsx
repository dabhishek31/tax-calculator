import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTaxCalculator } from '../hooks/useTaxCalculator';
import RegimeCard from '../components/RegimeCard';
import ProfileCard from '../components/ProfileCard';
import IncomeCard from '../components/IncomeCard';
import DeductionsCard from '../components/DeductionsCard';
import { formatINR } from '../utils/format';

export default function NewVsOldRegimePage() {
  const { input, update, config, result } = useTaxCalculator();

  return (
    <>
      <SEOHead
        title="New vs Old Tax Regime Calculator 2026-27 | Which Regime is Better? | India"
        description="Compare New Regime vs Old Regime for FY 2026-27. Enter your salary and deductions to instantly see which tax regime saves you more money. Detailed side-by-side analysis with slab breakdown."
        path="/new-vs-old-regime"
        breadcrumbs={[{ name: 'New vs Old Regime Calculator', path: '/new-vs-old-regime' }]}
      />

      <Header selectedYear={input.taxYear} onYearChange={year => update({ taxYear: year })} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" role="main">
        <Breadcrumbs items={[{ label: 'New vs Old Regime Calculator', path: '/new-vs-old-regime' }]} />

        <h1 className="text-3xl font-bold text-slate-800 mb-2">New Regime vs Old Regime — Which Tax Regime is Better?</h1>
        <p className="text-slate-500 text-sm mb-6">
          Enter your income and deductions below to get a personalized comparison for FY 2026-27.
          The calculator will show exactly how much you save under each regime.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Input Side */}
          <div className="lg:col-span-2 space-y-4">
            <ProfileCard input={input} update={update} />
            <IncomeCard input={input} update={update} />
            {config && <DeductionsCard input={input} update={update} config={config} />}
          </div>

          {/* Results Side */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-4">
            {result ? (
              <>
                {/* Recommendation Banner */}
                <div className={`rounded-xl p-4 flex items-center justify-between gap-3 ${
                  result.saving === 0
                    ? 'bg-slate-100 border border-slate-200'
                    : result.betterRegime === 'new'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                }`}>
                  <div>
                    {result.saving === 0 ? (
                      <p className="text-sm font-semibold text-slate-700">Both regimes result in the same tax.</p>
                    ) : (
                      <>
                        <p className="text-xs opacity-80 uppercase tracking-wide font-medium">
                          {result.betterRegime === 'new' ? 'New Regime' : 'Old Regime'} saves you
                        </p>
                        <p className="text-2xl font-bold">{formatINR(result.saving)} <span className="text-base font-normal opacity-90">this year</span></p>
                      </>
                    )}
                  </div>
                </div>

                {/* Side-by-side regime cards */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <RegimeCard result={result.newRegime} isRecommended={result.betterRegime === 'new'} />
                  <RegimeCard result={result.oldRegime} isRecommended={result.betterRegime === 'old'} />
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center">
                <div className="text-5xl mb-4">⚖️</div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Enter your income to compare regimes</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Fill in your gross salary and deductions. We will show a detailed side-by-side comparison.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Understanding the Two Tax Regimes in India</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            Since FY 2023-24, the New Tax Regime is the default option for all taxpayers in India. Under the Income Tax Act 2025 (effective 1 April 2026), this continues to be the case. The New Regime offers lower slab rates across 7 brackets, ranging from 0% to 30%, with a zero-tax threshold up to ₹4 lakh and a generous rebate under Section 87A for incomes up to ₹12 lakh.
          </p>
          <p className="text-slate-600 leading-relaxed mb-3">
            The Old Regime, which must be explicitly opted into (via Form 10-IEA for business/professional income), retains the traditional 3-bracket structure with higher base rates. However, it allows a comprehensive suite of deductions: Section 80C (₹1.5 lakh for PPF, ELSS, LIC, tuition fees), Section 80D (health insurance), Section 80CCD(1B) (NPS), HRA exemption, home loan interest under Section 24(b), and many more.
          </p>
        </article>

        <article className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-3">When to Choose the Old Regime</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            The Old Regime becomes beneficial when your total deductions exceed approximately ₹3.75 lakh. This typically happens when you have a combination of: full 80C investment (₹1.5L), NPS contribution (₹50K), health insurance premiums (₹25-50K), HRA exemption, and home loan interest. Higher-income taxpayers with home loans and families tend to benefit more from the Old Regime.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If you are unsure, enter your actual numbers in the calculator above to see a precise comparison. You can also visit our <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">main income tax calculator</Link> for a more detailed analysis including the investment optimizer and HRA computation.
          </p>
        </article>
      </section>
    </>
  );
}
