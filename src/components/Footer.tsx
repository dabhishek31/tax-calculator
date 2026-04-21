import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h2 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span>🇮🇳</span> India Tax Calculator
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Free, open-source income tax calculator for India.
              Compare New vs Old Regime for FY 2026-27 based on the Income Tax Act 2025.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Calculators</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Income Tax Calculator</Link></li>
              <li><Link to="/new-vs-old-regime" className="hover:text-white transition-colors">New vs Old Regime</Link></li>
              <li><Link to="/hra-calculator" className="hover:text-white transition-colors">HRA Exemption Calculator</Link></li>
              <li><Link to="/income-tax-slabs" className="hover:text-white transition-colors">Tax Slabs 2026-27</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/income-tax-slabs" className="hover:text-white transition-colors">Income Tax Slabs</Link></li>
              <li><a href="https://www.incometax.gov.in/iec/foportal/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Income Tax India (Official) ↗</a></li>
              <li><a href="https://github.com/dabhishek31/tax-calculator" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Source Code (GitHub) ↗</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <div className="border-t border-slate-700 pt-6">
          {/* Disclaimer */}
          <div className="bg-slate-700/50 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Disclaimer:</span> This calculator provides estimates for informational purposes only and does not constitute tax, legal, or financial advice.
              Calculations are based on the Income Tax Act 2025 effective 1 April 2026. Actual tax liability may vary.
              Consult a qualified Chartered Accountant (CA) for personalized tax planning. Surcharge marginal relief is not computed.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} India Tax Calculator. Open source under MIT License.</p>
            <p>Last updated: April 2026 · Reflects Union Budget 2026 changes</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
