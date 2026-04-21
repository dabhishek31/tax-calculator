
import { NavLink } from 'react-router-dom';
import { AVAILABLE_YEARS } from '../config/taxConfig';

interface Props {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const NAV_LINKS = [
  { to: '/',                    label: 'Tax Calculator' },
  { to: '/new-vs-old-regime',   label: 'New vs Old Regime' },
  { to: '/hra-calculator',      label: 'HRA Calculator' },
  { to: '/income-tax-slabs',    label: 'Tax Slabs' },
  { to: '/about',               label: 'About' },
];

export default function Header({ selectedYear, onYearChange }: Props) {
  return (
    <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white shadow-lg">
      {/* Top row — brand + year picker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <NavLink to="/" className="block">
            <p className="text-2xl font-bold tracking-tight flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span>🇮🇳</span> India Tax Calculator
            </p>
          </NavLink>
          <p className="text-indigo-200 text-sm mt-0.5">
            New Regime vs Old Regime · Investment Planner · Powered by Income Tax Act 2025
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-indigo-200 text-sm font-medium whitespace-nowrap">Financial Year</label>
          <select
            value={selectedYear}
            onChange={e => onYearChange(e.target.value)}
            className="bg-white/10 border border-white/30 text-white text-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-colors outline-none focus:ring-2 focus:ring-white/50"
          >
            {AVAILABLE_YEARS.map(y => (
              <option key={y} value={y} className="text-slate-800 bg-white">{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0" aria-label="Main navigation">
        <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none -mb-px">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to} className="flex-shrink-0">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-3 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-white text-white bg-white/10'
                      : 'border-transparent text-indigo-200 hover:text-white hover:border-white/50'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

