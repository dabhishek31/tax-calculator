import React, { useState } from 'react';
import { TaxInput, CityType } from '../types/tax';
import { TaxYearConfig } from '../types/tax';
import CurrencyInput from './CurrencyInput';

interface Props {
  input: TaxInput;
  update: (patch: Partial<TaxInput>) => void;
  config: TaxYearConfig;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span className="text-slate-400 text-lg">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 pt-3 pb-1">{children}</div>}
    </div>
  );
}

export default function DeductionsCard({ input, update, config }: Props) {
  const limits = config.oldRegime.deductionLimits;
  const isSelf = input.taxpayerType === 'senior' || input.taxpayerType === 'superSenior';
  const selfD_limit = isSelf ? limits.section80D_selfSenior : limits.section80D_selfNonSenior;
  const parentsD_limit = input.isSeniorParents ? limits.section80D_parentsSenior : limits.section80D_parentsNonSenior;
  const showHRA = input.employmentType === 'salaried';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
        <span className="bg-violet-100 text-violet-600 rounded-lg p-1.5 text-sm">🧾</span>
        Deductions & Exemptions
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        These apply to the <span className="font-semibold text-slate-600">Old Regime</span> for comparison.
        New Regime only allows Standard Deduction + Employer NPS.
      </p>

      <div className="space-y-3">

        {/* Retirement */}
        <Section title="Retirement & Savings (80C / 80CCD)">
          <CurrencyInput
            label="Section 80C"
            value={input.section80C}
            onChange={v => update({ section80C: v })}
            max={limits.section80C}
            hint="PPF, ELSS, LIC premium, tuition fees, home loan principal"
            tooltip="Combines PPF, ELSS, NSC, LIC, EPF, tuition fees, home loan principal — max ₹1.5L"
          />
          <CurrencyInput
            label="NPS Self Contribution (80CCD 1B)"
            value={input.section80CCD1B}
            onChange={v => update({ section80CCD1B: v })}
            max={limits.section80CCD1B}
            hint="Additional ₹50K deduction over & above the ₹1.5L 80C limit"
            tooltip="Over and above 80C. Great way to save extra ₹50K on tax while building a retirement corpus."
          />
          <CurrencyInput
            label="Employer NPS Contribution (80CCD 2)"
            value={input.employerNPS}
            onChange={v => update({ employerNPS: v })}
            hint={`Old regime: max 10% of basic · New regime: max 14% of basic`}
            tooltip="Employer's NPS contribution. Deductible in BOTH regimes. Enter annual employer NPS amount."
          />
        </Section>

        {/* Health */}
        <Section title="Health Insurance (80D)">
          <CurrencyInput
            label={`Self & Family (max ${isSelf ? '₹50,000' : '₹25,000'})`}
            value={input.section80D_self}
            onChange={v => update({ section80D_self: v })}
            max={selfD_limit}
            hint="Health insurance premium for self, spouse, children. Includes preventive checkup up to ₹5K."
            tooltip="If you are 60+, limit is ₹50,000. Includes preventive health checkup up to ₹5,000 within limit."
          />
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="seniorParents"
              checked={input.isSeniorParents}
              onChange={e => update({ isSeniorParents: e.target.checked })}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <label htmlFor="seniorParents" className="text-sm text-slate-600 cursor-pointer">
              Parents are senior citizens (60+)
            </label>
          </div>
          <CurrencyInput
            label={`Parents (max ${input.isSeniorParents ? '₹50,000' : '₹25,000'})`}
            value={input.section80D_parents}
            onChange={v => update({ section80D_parents: v })}
            max={parentsD_limit}
            hint="Separate from self insurance limit. Claimed even if parents not dependent."
            tooltip="Independent of self 80D limit. Senior parent limit is ₹50K. Non-senior limit is ₹25K."
          />
        </Section>

        {/* Housing */}
        <Section title="Housing (HRA + Home Loan)" defaultOpen={showHRA}>
          {showHRA && (
            <>
              <CurrencyInput
                label="Annual Rent Paid"
                value={input.rentPaid}
                onChange={v => update({ rentPaid: v })}
                hint="Total rent paid in the year. Required with Basic Salary & HRA for exemption calculation."
                tooltip="HRA exemption = Min(HRA received, 50%/40% of basic, Rent paid − 10% of basic)"
              />
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 mb-2">City Type (for HRA)</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['metro', 'non-metro'] as CityType[]).map(c => (
                    <button
                      key={c}
                      onClick={() => update({ cityType: c })}
                      className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                        input.cityType === c
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      {c === 'metro' ? 'Metro (50%)' : 'Non-Metro (40%)'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Metro (50%): Mumbai, Delhi, Chennai, Kolkata, Bengaluru, Hyderabad, Pune, Ahmedabad
                  <span className="text-sky-600 font-medium"> · 4 new cities added FY 2026-27</span>
                </p>
              </div>
            </>
          )}
          <CurrencyInput
            label="Home Loan Interest (Sec 24b)"
            value={input.homeLoanInterest}
            onChange={v => update({ homeLoanInterest: v })}
            max={limits.section24b_selfOccupied}
            hint="Interest paid on home loan for self-occupied property. Unlimited for let-out."
            tooltip="Self-occupied: capped at ₹2L. Let-out property: full interest is deductible (enter in other deductions)."
          />
        </Section>

        {/* Other */}
        <Section title="Other Deductions" defaultOpen={false}>
          <CurrencyInput
            label="Savings Interest (80TTA / 80TTB)"
            value={input.section80TTA}
            onChange={v => update({ section80TTA: v })}
            max={isSelf ? limits.section80TTB : limits.section80TTA}
            hint={isSelf ? 'Senior: FD/RD/savings interest up to ₹50K (80TTB)' : 'Savings account interest up to ₹10K (80TTA)'}
          />
          <CurrencyInput
            label="Other (80E, 80G, 80EEA, etc.)"
            value={input.otherDeductions}
            onChange={v => update({ otherDeductions: v })}
            hint="Education loan interest (80E), donations (80G), additional home loan interest (80EEA)"
            tooltip="Catch-all for 80E (education loan interest — full amount, 8 years), 80G (donations), and other eligible deductions."
          />
        </Section>

      </div>
    </div>
  );
}
