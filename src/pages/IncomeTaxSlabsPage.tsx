import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { TAX_CONFIGS, DEFAULT_YEAR } from '../config/taxConfig';

export default function IncomeTaxSlabsPage() {
  const config = TAX_CONFIGS[DEFAULT_YEAR];

  const pageSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Income Tax Slabs FY 2026-27 | New & Old Regime | Standard Deduction',
      'url': 'https://itrplanner.in/income-tax-slabs',
      'description': 'Complete income tax slab rates for FY 2026-27 (AY 2027-28). New Regime slabs, Old Regime slabs by age, standard deduction ₹75,000, and deduction limits.',
      'inLanguage': 'en-IN',
      'dateModified': '2026-04-29',
      'isPartOf': { '@type': 'WebSite', 'url': 'https://itrplanner.in/' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': 'Income Tax Slabs for FY 2026-27 (AY 2027-28): New Regime vs Old Regime',
      'description': 'Complete guide to income tax slab rates for FY 2026-27. Includes New Regime slabs with zero-tax up to ₹12.75L, Old Regime slabs for all age groups, standard deduction, surcharge rates, and worked examples.',
      'url': 'https://itrplanner.in/income-tax-slabs',
      'inLanguage': 'en-IN',
      'dateModified': '2026-04-29',
      'datePublished': '2026-04-20',
      'author': { '@type': 'Person', 'name': 'Abhishek Das', 'url': 'https://github.com/dabhishek31' },
      'publisher': { '@type': 'Organization', 'name': 'ITR Planner', 'logo': { '@type': 'ImageObject', 'url': 'https://itrplanner.in/favicon.svg' } },
      'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://itrplanner.in/income-tax-slabs' },
    },
  ];

  return (
    <>
      <SEOHead
        title="Income Tax Slabs FY 2026-27 | New & Old Regime + Standard Deduction | ITR Planner"
        description="Complete income tax slab rates for FY 2026-27 (AY 2027-28). New Regime: zero tax up to ₹12.75L. Standard deduction ₹75,000 for salaried. Old Regime slabs for all age groups. Updated for Income Tax Act 2025."
        path="/income-tax-slabs"
        breadcrumbs={[{ name: 'Income Tax Slabs FY 2026-27', path: '/income-tax-slabs' }]}
        schema={pageSchema}
      />

      <Header selectedYear={DEFAULT_YEAR} onYearChange={() => {}} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6" role="main">
        <Breadcrumbs items={[{ label: 'Income Tax Slabs 2026-27', path: '/income-tax-slabs' }]} />

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Income Tax Slabs for FY 2026-27 (AY 2027-28)</h1>
        <p className="text-slate-500 text-sm mb-8">
          Updated for the Income Tax Act 2025, effective 1 April 2026. All rates include surcharge and cess applicability.
          Last updated: April 2026.
        </p>

        {/* New Regime Slabs */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 rounded-lg p-1.5 text-sm">📊</span>
            New Regime Tax Slabs (Default — Section 115BAC)
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            The New Tax Regime is the default option for all taxpayers from FY 2023-24 onwards. Under this regime, the same slab rates apply to all individuals regardless of age. Very few deductions are allowed — only standard deduction (₹75,000 for salaried) and employer NPS contribution (up to 14% of basic).
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Income Slab (₹)</th>
                  <th className="text-right px-4 py-3 font-semibold">Tax Rate</th>
                  <th className="text-right px-4 py-3 font-semibold">Tax on Slab</th>
                </tr>
              </thead>
              <tbody>
                {config.newRegime.slabs.map((slab, i) => {
                  const taxable = slab.to === Infinity ? '—' : `₹${((slab.to - slab.from) * slab.rate).toLocaleString('en-IN')}`;
                  return (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-2.5 text-slate-700 border-b border-slate-100">
                        {slab.to === Infinity
                          ? `Above ₹${slab.from.toLocaleString('en-IN')}`
                          : `₹${slab.from.toLocaleString('en-IN')} – ₹${slab.to.toLocaleString('en-IN')}`}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border-b border-slate-100">
                        {slab.rate === 0 ? 'Nil' : `${(slab.rate * 100).toFixed(0)}%`}
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-600 border-b border-slate-100">
                        {slab.rate === 0 ? '₹0' : taxable}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-indigo-50 rounded-lg px-4 py-3 text-sm text-indigo-800">
            <strong>Rebate u/s 87A:</strong> If taxable income ≤ ₹{config.newRegime.rebate87A.incomeLimit.toLocaleString('en-IN')}, you get a rebate of up to ₹{config.newRegime.rebate87A.maxRebate.toLocaleString('en-IN')} — making your effective tax <strong>zero</strong>.
            For salaried employees, this means gross salary up to ~₹12.75L results in zero tax.
          </div>
        </section>

        {/* Old Regime Slabs */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-600 rounded-lg p-1.5 text-sm">📊</span>
            Old Regime Tax Slabs (Opt-in)
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            The Old Regime must be explicitly opted into. It has higher base rates but allows deductions under 80C (₹1.5L), 80D, 80CCD(1B), HRA, home loan interest u/s 24(b), and more. Different slab rates apply based on age.
          </p>

          {/* Below 60 */}
          <h3 className="text-base font-semibold text-slate-700 mb-2 mt-6">Individuals Below 60 Years</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Income Slab (₹)</th>
                  <th className="text-right px-4 py-3 font-semibold">Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                {config.oldRegime.slabsBelow60.map((slab, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2.5 text-slate-700 border-b border-slate-100">
                      {slab.to === Infinity
                        ? `Above ₹${slab.from.toLocaleString('en-IN')}`
                        : `₹${slab.from.toLocaleString('en-IN')} – ₹${slab.to.toLocaleString('en-IN')}`}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border-b border-slate-100">
                      {slab.rate === 0 ? 'Nil' : `${(slab.rate * 100).toFixed(0)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Senior Citizens */}
          <h3 className="text-base font-semibold text-slate-700 mb-2 mt-6">Senior Citizens (60–79 Years)</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-600 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Income Slab (₹)</th>
                  <th className="text-right px-4 py-3 font-semibold">Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                {config.oldRegime.slabsSenior.map((slab, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2.5 text-slate-700 border-b border-slate-100">
                      {slab.to === Infinity
                        ? `Above ₹${slab.from.toLocaleString('en-IN')}`
                        : `₹${slab.from.toLocaleString('en-IN')} – ₹${slab.to.toLocaleString('en-IN')}`}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border-b border-slate-100">
                      {slab.rate === 0 ? 'Nil' : `${(slab.rate * 100).toFixed(0)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Super Senior */}
          <h3 className="text-base font-semibold text-slate-700 mb-2 mt-6">Super Senior Citizens (80+ Years)</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-rose-600 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Income Slab (₹)</th>
                  <th className="text-right px-4 py-3 font-semibold">Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                {config.oldRegime.slabsSuperSenior.map((slab, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2.5 text-slate-700 border-b border-slate-100">
                      {slab.to === Infinity
                        ? `Above ₹${slab.from.toLocaleString('en-IN')}`
                        : `₹${slab.from.toLocaleString('en-IN')} – ₹${slab.to.toLocaleString('en-IN')}`}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border-b border-slate-100">
                      {slab.rate === 0 ? 'Nil' : `${(slab.rate * 100).toFixed(0)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Deduction Limits */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="bg-sky-100 text-sky-600 rounded-lg p-1.5 text-sm">💰</span>
            Deduction Limits (Old Regime Only)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Section</th>
                  <th className="text-left px-4 py-3 font-semibold">Description</th>
                  <th className="text-right px-4 py-3 font-semibold">Limit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Standard Deduction', 'Salaried / Pensioners', '50,000'],
                  ['80C', 'PPF, ELSS, LIC, Tuition, Home Loan Principal', '1,50,000'],
                  ['80CCD(1B)', 'NPS Self Contribution (additional)', '50,000'],
                  ['80CCD(2)', 'Employer NPS', '10% of basic'],
                  ['80D (Self)', 'Health Insurance — Self & Family', '25,000 / 50,000*'],
                  ['80D (Parents)', 'Health Insurance — Parents', '25,000 / 50,000*'],
                  ['24(b)', 'Home Loan Interest (Self-Occupied)', '2,00,000'],
                  ['HRA', 'House Rent Allowance', 'Formula-based†'],
                  ['80TTA', 'Savings Account Interest (non-seniors)', '10,000'],
                  ['80TTB', 'Interest Income (seniors only)', '50,000'],
                ].map(([section, desc, limit]) => (
                  <tr key={section} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-semibold text-indigo-700 border-b border-slate-100">{section}</td>
                    <td className="px-4 py-2.5 text-slate-600 border-b border-slate-100">{desc}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border-b border-slate-100">₹{limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            * ₹50,000 limit applies if the insured person is a senior citizen (60+). † HRA = Minimum of (HRA received, 50%/40% of basic, Rent − 10% of basic). See <Link to="/hra-calculator" className="text-indigo-600 hover:text-indigo-800 font-medium">HRA Calculator</Link>.
          </p>
        </section>

        {/* Surcharge */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Surcharge Rates on Income Tax</h2>
          <p className="text-sm text-slate-600 mb-4">
            A surcharge is levied on the income tax amount (not on income) when taxable income exceeds ₹50 lakh. Under the New Regime, the maximum surcharge is capped at 25%.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-slate-600 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Taxable Income</th>
                  <th className="text-right px-4 py-3 font-semibold">New Regime</th>
                  <th className="text-right px-4 py-3 font-semibold">Old Regime</th>
                </tr>
              </thead>
              <tbody>
                {config.surcharge.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2.5 text-slate-700 border-b border-slate-100">
                      {s.to === Infinity
                        ? `Above ₹${(s.from / 10000000).toFixed(0)} Cr`
                        : `₹${(s.from / 100000).toFixed(0)}L – ₹${(s.to / 10000000 >= 1 ? (s.to / 10000000).toFixed(0) + ' Cr' : (s.to / 100000).toFixed(0) + 'L')}`}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border-b border-slate-100">{(s.rateNew * 100).toFixed(0)}%</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border-b border-slate-100">{(s.rateOld * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-2">Health & Education Cess @ 4% is levied on (Tax + Surcharge).</p>
        </section>

        {/* Worked Example */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Worked Example — ₹20L Income (New Regime)</h2>
          <p className="text-sm text-slate-600 mb-4">
            Salaried employee, age below 60, gross salary ₹20,00,000. Standard deduction ₹75,000 applies under New Regime.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Slab</th>
                  <th className="text-right px-4 py-3 font-semibold">Taxable Amount</th>
                  <th className="text-right px-4 py-3 font-semibold">Rate</th>
                  <th className="text-right px-4 py-3 font-semibold">Tax</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['₹0 – ₹4,00,000', '₹4,00,000', 'Nil', '₹0'],
                  ['₹4,00,001 – ₹8,00,000', '₹4,00,000', '5%', '₹20,000'],
                  ['₹8,00,001 – ₹12,00,000', '₹4,00,000', '10%', '₹40,000'],
                  ['₹12,00,001 – ₹16,00,000', '₹4,00,000', '15%', '₹60,000'],
                  ['₹16,00,001 – ₹19,25,000*', '₹3,25,000', '20%', '₹65,000'],
                ].map(([slab, taxable, rate, tax], i) => (
                  <tr key={slab} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2.5 text-slate-700 border-b border-slate-100">{slab}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 border-b border-slate-100">{taxable}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border-b border-slate-100">{rate}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 border-b border-slate-100">{tax}</td>
                  </tr>
                ))}
                <tr className="bg-indigo-50 font-semibold">
                  <td className="px-4 py-2.5 text-slate-800" colSpan={3}>Total Income Tax</td>
                  <td className="px-4 py-2.5 text-right text-indigo-700">₹1,85,000</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-700" colSpan={3}>Add: Health &amp; Education Cess (4%)</td>
                  <td className="px-4 py-2.5 text-right text-slate-700">₹7,400</td>
                </tr>
                <tr className="bg-indigo-50 font-bold">
                  <td className="px-4 py-2.5 text-slate-800" colSpan={3}>Total Tax Payable</td>
                  <td className="px-4 py-2.5 text-right text-indigo-700">₹1,92,400</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">* Taxable income = ₹20,00,000 − ₹75,000 standard deduction = ₹19,25,000. No surcharge applies (income below ₹50L).</p>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Calculate Your Exact Tax</h2>
          <p className="text-indigo-200 text-sm mb-4">Enter your salary and deductions to see a personalized comparison of both regimes.</p>
          <Link to="/" className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors shadow-md">
            Open Tax Calculator →
          </Link>
        </div>
      </main>
    </>
  );
}
