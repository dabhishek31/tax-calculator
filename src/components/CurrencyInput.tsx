
import { formatINR } from '../utils/format';

interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
  hint?: string;
  tooltip?: string;
  disabled?: boolean;
}

export default function CurrencyInput({ label, value, onChange, max, hint, tooltip, disabled }: Props) {
  const exceeded = max !== undefined && value > max;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
          {label}
          {tooltip && (
            <span className="group relative cursor-help">
              <span className="text-slate-400 text-xs border border-slate-300 rounded-full w-4 h-4 inline-flex items-center justify-center">?</span>
              <span className="hidden group-hover:block absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-1 w-56 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        {max !== undefined && (
          <span className={`text-xs ${exceeded ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>
            Max: {formatINR(max)}
          </span>
        )}
      </div>

      <div className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
        disabled ? 'bg-slate-50 border-slate-200' :
        exceeded ? 'border-amber-400 ring-1 ring-amber-300' :
        'border-slate-200 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-200'
      }`}>
        <span className="px-3 py-2 bg-slate-50 border-r border-slate-200 text-slate-500 text-sm font-medium">₹</span>
        <input
          type="number"
          min={0}
          max={max}
          value={value || ''}
          disabled={disabled}
          onChange={e => onChange(Math.max(0, Number(e.target.value)))}
          placeholder="0"
          className="flex-1 px-3 py-2 text-sm text-slate-800 bg-white outline-none disabled:bg-slate-50 disabled:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {exceeded && max !== undefined && (
        <p className="mt-1 text-xs text-amber-600">Exceeds limit — capped at {formatINR(max)}</p>
      )}
    </div>
  );
}
