import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTaxCalculator } from '../hooks/useTaxCalculator';
import HRAOptimizer from '../components/HRAOptimizer';
import CurrencyInput from '../components/CurrencyInput';

export default function HRACalculatorPage() {
  const { input, update, hraOptimization } = useTaxCalculator();

  return (
    <>
      <SEOHead
        title="HRA Exemption Calculator 2026-27 | House Rent Allowance Tax Benefit | India"
        description="Free HRA exemption calculator for FY 2026-27. Calculate your House Rent Allowance tax benefit under the Old Regime. See optimal rent to maximize HRA. Includes new 8 metro cities list (Bengaluru, Hyderabad, Pune, Ahmedabad added)."
        path="/hra-calculator"
      />

      <Header selectedYear={input.taxYear} onYearChange={year => update({ taxYear: year })} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6" role="main">
        <Breadcrumbs items={[{ label: 'HRA Exemption Calculator', path: '/hra-calculator' }]} />

        <h1 className="text-3xl font-bold text-slate-800 mb-2">HRA Exemption Calculator — FY 2026-27</h1>
        <p className="text-slate-500 text-sm mb-6">
          Calculate your House Rent Allowance tax exemption under the Old Regime. Find the optimal rent to pay to fully utilize your HRA benefit.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Input Side */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Your Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="hra-basic">Annual Basic Salary</label>
                  <CurrencyInput id="hra-basic" value={input.basicSalary} onChange={v => update({ basicSalary: v })} placeholder="e.g. 6,00,000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="hra-received">Annual HRA Received</label>
                  <CurrencyInput id="hra-received" value={input.hraReceived} onChange={v => update({ hraReceived: v })} placeholder="e.g. 2,40,000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="hra-rent">Annual Rent Paid</label>
                  <CurrencyInput id="hra-rent" value={input.rentPaid} onChange={v => update({ rentPaid: v })} placeholder="e.g. 1,80,000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="hra-city">City Type</label>
                  <select
                    id="hra-city"
                    value={input.cityType}
                    onChange={e => update({ cityType: e.target.value as 'metro' | 'non-metro' })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="metro">Metro (50%) — Mumbai, Delhi, Chennai, Kolkata, Bengaluru, Hyderabad, Pune, Ahmedabad</option>
                    <option value="non-metro">Non-Metro (40%) — All other cities</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:sticky lg:top-4">
            {hraOptimization ? (
              <HRAOptimizer optimization={hraOptimization} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Enter your details</h3>
                <p className="text-sm text-slate-500">Fill in Basic Salary, HRA Received, and Rent Paid to see your HRA optimization.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">How HRA Exemption Works</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            House Rent Allowance (HRA) is a component of your salary that your employer pays towards your rental expenses. Under the Old Tax Regime, you can claim a tax exemption on this HRA, provided you actually pay rent for your accommodation. The HRA exemption is not available under the New Tax Regime.
          </p>
          <p className="text-slate-600 leading-relaxed mb-3">
            The HRA exemption amount is calculated as the <strong>minimum of three conditions</strong>:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 text-sm leading-relaxed mb-4">
            <li><strong>Actual HRA received</strong> from your employer during the year</li>
            <li><strong>50% of basic salary</strong> if you live in a metro city, or <strong>40% of basic salary</strong> for non-metro cities</li>
            <li><strong>Rent paid minus 10% of basic salary</strong> — only the excess rent over 10% of your basic counts</li>
          </ol>
        </article>

        <article className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Metro Cities for HRA — FY 2026-27 Update</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            From FY 2026-27, under the new Income Tax Rules 2026, four additional cities now qualify for the 50% HRA rate (previously only available for Mumbai, Delhi, Chennai, and Kolkata):
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Bengaluru ✨', 'Hyderabad ✨', 'Pune ✨', 'Ahmedabad ✨'].map(city => (
              <li key={city} className="bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium text-center border border-slate-100">
                {city}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">✨ = Newly added from 1 April 2026</p>
        </article>

        <article className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Compliance Requirements</h2>
          <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
            <li>• If annual rent exceeds ₹1,00,000, you <strong>must</strong> provide your landlord's PAN to your employer</li>
            <li>• From FY 2026-27, new IT Rules 2026 require disclosing the landlord–tenant relationship when claiming HRA</li>
            <li>• Keep rent receipts and a rent agreement as proof</li>
            <li>• HRA exemption is only available under the <strong>Old Tax Regime</strong></li>
          </ul>
        </article>

        <div className="bg-indigo-50 rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Want to compare both regimes?</h2>
          <p className="text-sm text-slate-500 mb-4">See if your HRA savings make the Old Regime better than the New Regime.</p>
          <Link to="/" className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
            Open Full Tax Calculator →
          </Link>
        </div>
      </section>
    </>
  );
}
