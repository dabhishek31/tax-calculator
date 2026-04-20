
import { TaxInput } from '../types/tax';
import CurrencyInput from './CurrencyInput';

interface Props {
  input: TaxInput;
  update: (patch: Partial<TaxInput>) => void;
}

export default function IncomeCard({ input, update }: Props) {
  const showHRA = input.employmentType === 'salaried';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-emerald-100 text-emerald-600 rounded-lg p-1.5 text-sm">💰</span>
        Annual Income
      </h2>

      <CurrencyInput
        label="Gross Salary / Income"
        value={input.grossSalary}
        onChange={v => update({ grossSalary: v })}
        hint="Total CTC or gross annual income before any deductions"
        tooltip="Enter your total gross salary (Cost to Company). Includes basic, HRA, allowances, bonus."
      />

      {showHRA && (
        <>
          <CurrencyInput
            label="Basic Salary"
            value={input.basicSalary}
            onChange={v => update({ basicSalary: v })}
            hint="Used for HRA exemption & employer NPS calculation"
            tooltip="Typically 40–50% of CTC. Required for accurate HRA and NPS computation."
          />
          <CurrencyInput
            label="HRA Received (from employer)"
            value={input.hraReceived}
            onChange={v => update({ hraReceived: v })}
            tooltip="House Rent Allowance received from employer. Usually shown in your salary slip."
          />
        </>
      )}

      <CurrencyInput
        label="Other Income"
        value={input.otherIncome}
        onChange={v => update({ otherIncome: v })}
        hint="FD interest, freelance, capital gains, etc."
        tooltip="Income from sources other than salary — FD interest, savings interest, freelance income, etc."
      />

      <CurrencyInput
        label="Rental Income (Annual)"
        value={input.rentalIncome}
        onChange={v => update({ rentalIncome: v })}
        hint="Gross rent received. Standard deduction of 30% is auto-applied."
        tooltip="Annual rental income. As per Income Tax Act, 30% standard deduction on rental income is available."
      />
    </div>
  );
}
