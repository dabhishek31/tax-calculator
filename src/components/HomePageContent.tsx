import { Link } from 'react-router-dom';

export default function HomePageContent() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-label="Tax calculator guide and frequently asked questions">

      {/* How to Use */}
      <article className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Income Tax Calculator</h2>
        <p className="text-slate-600 leading-relaxed mb-3">
          This free online income tax calculator helps you estimate your tax liability for Financial Year 2026-27 (Assessment Year 2027-28) under both the New Regime and Old Regime. It is based on the Income Tax Act 2025, which came into effect on 1 April 2026.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-slate-600 text-sm leading-relaxed">
          <li><strong>Select your profile</strong> — Choose your age category (below 60, senior citizen, or super senior) and employment type (salaried or business).</li>
          <li><strong>Enter your income</strong> — Fill in your gross salary/CTC. If salaried, add your basic salary and HRA received for accurate HRA calculation.</li>
          <li><strong>Add deductions</strong> — Enter your investments under Section 80C, 80D, NPS, home loan interest, and other deductions. These apply to the Old Regime comparison.</li>
          <li><strong>View results instantly</strong> — The calculator shows a side-by-side comparison of both regimes, recommends the better one, and shows potential tax savings through more investments.</li>
        </ol>
      </article>

      {/* Tax Slabs Quick Reference */}
      <article className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Income Tax Slabs for FY 2026-27 — New Regime</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Under the New Tax Regime (default under Section 115BAC of the Income Tax Act 2025), the following slab rates apply to all individuals regardless of age. A standard deduction of ₹75,000 is available for salaried taxpayers.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-50">
                <th className="text-left px-4 py-3 font-semibold text-indigo-900 border border-indigo-100">Income Slab (₹)</th>
                <th className="text-right px-4 py-3 font-semibold text-indigo-900 border border-indigo-100">Tax Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Up to ₹4,00,000', 'Nil'],
                ['₹4,00,001 – ₹8,00,000', '5%'],
                ['₹8,00,001 – ₹12,00,000', '10%'],
                ['₹12,00,001 – ₹16,00,000', '15%'],
                ['₹16,00,001 – ₹20,00,000', '20%'],
                ['₹20,00,001 – ₹24,00,000', '25%'],
                ['Above ₹24,00,000', '30%'],
              ].map(([slab, rate]) => (
                <tr key={slab} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-700 border border-slate-100">{slab}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border border-slate-100">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-500">
          <strong>Rebate u/s 87A:</strong> If your taxable income is ≤ ₹12,00,000, you get a rebate of up to ₹60,000 — making your effective tax zero.
          For the full slab reference including Old Regime and senior citizen slabs, see our <Link to="/income-tax-slabs" className="text-indigo-600 hover:text-indigo-800 font-medium">Income Tax Slabs 2026-27</Link> page.
        </p>
      </article>

      {/* New vs Old */}
      <article className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">New Regime vs Old Regime — Which is Better for You?</h2>
        <p className="text-slate-600 leading-relaxed mb-3">
          The New Regime is the default option under the Income Tax Act 2025. It offers lower tax rates but allows very few deductions — only standard deduction (₹75,000) and employer NPS contribution (up to 14% of basic salary). Most taxpayers earning under ₹12 lakh will pay zero tax under the New Regime thanks to the Section 87A rebate.
        </p>
        <p className="text-slate-600 leading-relaxed mb-3">
          The Old Regime has higher base rates but allows a wide range of deductions: Section 80C (₹1.5 lakh), 80D health insurance, NPS under 80CCD(1B), HRA exemption, home loan interest under Section 24(b), and more. If your total deductions exceed ₹3-4 lakh, the Old Regime may result in lower tax.
        </p>
        <p className="text-slate-600 leading-relaxed mb-3">
          <strong>Rule of thumb:</strong> If you have significant investments (PPF, ELSS, NPS), health insurance, HRA, and a home loan, check the Old Regime. Otherwise, the New Regime is simpler and often better.
        </p>
        <p className="text-sm text-slate-500">
          Use our <Link to="/new-vs-old-regime" className="text-indigo-600 hover:text-indigo-800 font-medium">New vs Old Regime comparison calculator</Link> for a detailed side-by-side analysis with your actual numbers.
        </p>
      </article>

      {/* FAQ */}
      <article className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: 'Which tax regime is better for a ₹10 lakh salary?',
              a: 'For a gross salary of ₹10 lakh with no deductions, the New Regime is better. After ₹75,000 standard deduction, your taxable income is ₹9.25 lakh. Since this is below ₹12 lakh, you get a full rebate u/s 87A, resulting in zero tax. Under the Old Regime, you would need deductions of at least ₹2.5 lakh to match this.',
            },
            {
              q: 'What is the standard deduction for FY 2026-27?',
              a: 'Under the New Regime, salaried employees and pensioners get a standard deduction of ₹75,000. Under the Old Regime, the standard deduction is ₹50,000. This deduction is automatic — no proof or investment required.',
            },
            {
              q: 'How is HRA exemption calculated?',
              a: 'HRA exemption (available only under Old Regime) is the minimum of three values: (1) Actual HRA received, (2) 50% of basic salary for metro cities or 40% for non-metro, and (3) Rent paid minus 10% of basic salary. From FY 2026-27, Bengaluru, Hyderabad, Pune, and Ahmedabad are classified as metro cities at the 50% rate.',
            },
            {
              q: 'Is there a rebate under the New Regime?',
              a: 'Yes. Under Section 87A, if your taxable income (after standard deduction) does not exceed ₹12,00,000, you get a rebate of up to ₹60,000. This effectively means salaried persons earning up to ₹12.75 lakh (₹12L + ₹75K standard deduction) pay zero tax under the New Regime.',
            },
            {
              q: 'When did the new Income Tax Act 2025 come into effect?',
              a: 'The Income Tax Act 2025 came into effect on 1 April 2026, replacing the Income Tax Act 1961. It consolidates and simplifies tax provisions. The tax slabs, rates, and deduction limits for FY 2026-27 remain the same as FY 2025-26. Our calculator is fully updated for this new act.',
            },
            {
              q: 'Can I claim both 80C and NPS deductions?',
              a: 'Under the Old Regime, yes. Section 80C allows up to ₹1.5 lakh (PPF, ELSS, LIC, etc.). Section 80CCD(1B) allows an additional ₹50,000 for NPS self-contribution, over and above the 80C limit. Employer NPS is separately deductible under 80CCD(2) in both regimes.',
            },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-slate-200 rounded-lg">
              <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-slate-700 hover:text-indigo-700 transition-colors flex items-center justify-between">
                {q}
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                {a}
              </div>
            </details>
          ))}
        </div>
      </article>

      {/* Internal Links */}
      <nav className="bg-indigo-50 rounded-xl p-6 mb-6" aria-label="Related calculators">
        <h2 className="text-lg font-bold text-slate-800 mb-3">Related Calculators & Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/hra-calculator" className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-indigo-100 hover:border-indigo-300 hover:shadow-sm transition-all">
            <span className="text-lg">🏠</span>
            <div>
              <p className="text-sm font-semibold text-slate-700">HRA Exemption Calculator</p>
              <p className="text-xs text-slate-500">Optimize your rent to maximize HRA tax benefit</p>
            </div>
          </Link>
          <Link to="/new-vs-old-regime" className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-indigo-100 hover:border-indigo-300 hover:shadow-sm transition-all">
            <span className="text-lg">⚖️</span>
            <div>
              <p className="text-sm font-semibold text-slate-700">New vs Old Regime Comparison</p>
              <p className="text-xs text-slate-500">Detailed side-by-side regime analysis</p>
            </div>
          </Link>
          <Link to="/income-tax-slabs" className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-indigo-100 hover:border-indigo-300 hover:shadow-sm transition-all">
            <span className="text-lg">📊</span>
            <div>
              <p className="text-sm font-semibold text-slate-700">Income Tax Slabs 2026-27</p>
              <p className="text-xs text-slate-500">Complete slab rates for all regimes and age groups</p>
            </div>
          </Link>
          <a href="https://github.com/dabhishek31/tax-calculator" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-indigo-100 hover:border-indigo-300 hover:shadow-sm transition-all">
            <span className="text-lg">💻</span>
            <div>
              <p className="text-sm font-semibold text-slate-700">Open Source on GitHub</p>
              <p className="text-xs text-slate-500">View source code, report issues, contribute</p>
            </div>
          </a>
        </div>
      </nav>
    </section>
  );
}
