
import { TaxInput, TaxpayerType, EmploymentType } from '../types/tax';

interface Props {
  input: TaxInput;
  update: (patch: Partial<TaxInput>) => void;
}

const taxpayerOptions: { value: TaxpayerType; label: string; sub: string }[] = [
  { value: 'individual',   label: 'Individual',     sub: 'Below 60 years' },
  { value: 'senior',       label: 'Senior Citizen', sub: '60 – 79 years' },
  { value: 'superSenior',  label: 'Super Senior',   sub: '80+ years' },
];

const employmentOptions: { value: EmploymentType; label: string; sub: string }[] = [
  { value: 'salaried',  label: 'Salaried',          sub: '₹75K / ₹50K std. deduction' },
  { value: 'business',  label: 'Business / Self-Employed', sub: 'No standard deduction' },
];

function ToggleGroup<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string; sub: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-lg border-2 px-3 py-2.5 text-left transition-all ${
            value === opt.value
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
          }`}
        >
          <div className="font-semibold text-sm">{opt.label}</div>
          <div className="text-xs opacity-75 mt-0.5">{opt.sub}</div>
        </button>
      ))}
    </div>
  );
}

export default function ProfileCard({ input, update }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-indigo-100 text-indigo-600 rounded-lg p-1.5 text-sm">👤</span>
        Taxpayer Profile
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">Age Category</p>
          <ToggleGroup
            options={taxpayerOptions}
            value={input.taxpayerType}
            onChange={v => update({ taxpayerType: v })}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">Employment Type</p>
          <ToggleGroup
            options={employmentOptions}
            value={input.employmentType}
            onChange={v => update({ employmentType: v })}
          />
        </div>
      </div>
    </div>
  );
}
