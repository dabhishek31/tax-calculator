import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About — India Income Tax Calculator"
        description="About the India Income Tax Calculator. Built by Abhishek Das. Open-source, free, and privacy-first tax calculator based on the Income Tax Act 2025."
        path="/about"
        breadcrumbs={[{ name: 'About', path: '/about' }]}
      />

      <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="text-2xl">🇮🇳</span> India Tax Calculator
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6" role="main">
        <Breadcrumbs items={[{ label: 'About', path: '/about' }]} />

        <h1 className="text-3xl font-bold text-slate-800 mb-6">About This Calculator</h1>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-3">What is This Tool?</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              The India Income Tax Calculator is a free, open-source tool that helps Indian taxpayers estimate their income tax liability for FY 2026-27 (Assessment Year 2027-28). It provides a real-time comparison between the New Tax Regime and Old Tax Regime, so you can make an informed choice about which regime to opt for.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The calculator covers all major deduction sections (80C, 80D, 80CCD, 24(b), HRA), handles all taxpayer types (individual, senior citizen, super senior citizen), and includes an investment optimizer that shows you exactly how much more to invest to reduce your tax liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-3">Built By</h2>
            <div className="bg-slate-50 rounded-xl p-6 flex items-start gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                👨‍💻
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Abhishek Das</h3>
                <p className="text-sm text-slate-600 mb-2">Senior Architect – Platform</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">
                  I built this calculator to help fellow Indian taxpayers understand and optimize their tax liability. The tool is fully open-source and free to use, with no data collection or tracking.
                </p>
                <div className="flex gap-3">
                  <a href="https://github.com/dabhishek31" target="_blank" rel="noopener noreferrer"
                     className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    GitHub ↗
                  </a>
                  <a href="https://github.com/dabhishek31/tax-calculator" target="_blank" rel="noopener noreferrer"
                     className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Source Code ↗
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-3">Data Sources & Accuracy</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>Tax slabs and rates sourced from the <strong>Income Tax Act 2025</strong> (effective 1 April 2026)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>Deduction limits verified against <strong>Union Budget 2026</strong> and official gazette notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>Metro city list for HRA updated per <strong>Income Tax Rules 2026</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>All calculations are performed locally in your browser — <strong>no data is sent to any server</strong></span>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-3">Technology</h2>
            <p className="text-sm text-slate-600 mb-3">
              Built with React, TypeScript, and Tailwind CSS. The tax calculation engine is a pure TypeScript function with zero external dependencies. Configuration for each financial year lives in a single file, making it trivially easy to update for new budgets.
            </p>
            <p className="text-sm text-slate-600">
              The entire source code is <a href="https://github.com/dabhishek31/tax-calculator" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">available on GitHub</a> under the MIT License.
            </p>
          </section>

          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
            <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only and does not constitute tax, legal, or financial advice. Actual tax liability may vary. Please consult a qualified Chartered Accountant (CA) for personalized tax planning and filing.
          </div>
        </div>
      </main>
    </>
  );
}
