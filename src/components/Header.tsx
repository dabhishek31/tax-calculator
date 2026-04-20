
import { AVAILABLE_YEARS } from '../config/taxConfig';

interface Props {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export default function Header({ selectedYear, onYearChange }: Props) {
  return (
    <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">🇮🇳</span> India Tax Calculator
          </h1>
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
    </header>
  );
}
