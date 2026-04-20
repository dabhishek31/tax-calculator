
import { HRAOptimizationResult, HRABindingConstraint } from '../types/tax';
import { formatINR, formatPct } from '../utils/format';

interface Props {
  optimization: HRAOptimizationResult;
}

function ConditionRow({
  number, label, value, isBinding, isLowest,
}: {
  number: number; label: string; value: number; isBinding: boolean; isLowest: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
      isLowest
        ? isBinding
          ? 'border-amber-400 bg-amber-50'
          : 'border-emerald-400 bg-emerald-50'
        : 'border-slate-100 bg-slate-50'
    }`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
        isLowest
          ? isBinding ? 'bg-amber-400 text-white' : 'bg-emerald-500 text-white'
          : 'bg-slate-200 text-slate-500'
      }`}>
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-600 truncate">{label}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${isLowest ? (isBinding ? 'text-amber-700' : 'text-emerald-700') : 'text-slate-500'}`}>
          {formatINR(value)}
        </p>
        {isLowest && (
          <p className={`text-xs font-medium ${isBinding ? 'text-amber-500' : 'text-emerald-500'}`}>
            {isBinding ? '← binding (lowest)' : '✓ ceiling'}
          </p>
        )}
      </div>
    </div>
  );
}

const CONSTRAINT_MESSAGES: Record<HRABindingConstraint, { color: string; icon: string; text: string }> = {
  rent_paid: {
    color: 'amber',
    icon: '⚠️',
    text: 'Your rent paid is too low — increase rent to claim more HRA exemption.',
  },
  city_cap: {
    color: 'slate',
    icon: 'ℹ️',
    text: 'City cap (basic × %) is lower than HRA received — some HRA is permanently taxable regardless of rent.',
  },
  hra_received: {
    color: 'slate',
    icon: 'ℹ️',
    text: 'HRA from employer is the ceiling. You cannot claim more than what your employer gives as HRA.',
  },
  fully_utilized: {
    color: 'emerald',
    icon: '✅',
    text: 'Your HRA is fully optimized! You are claiming the maximum possible exemption.',
  },
};

export default function HRAOptimizer({ optimization: o }: Props) {
  if (!o.hasHRAData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <span className="bg-sky-100 text-sky-600 rounded-lg p-1.5 text-sm">🏠</span>
          HRA Optimizer
        </h2>
        <div className="text-center py-6">
          <p className="text-sm text-slate-500 mb-1">Enter your details to see HRA optimization</p>
          <p className="text-xs text-slate-400">Required: Basic Salary + HRA Received (in Income section)</p>
        </div>
      </div>
    );
  }

  const { bindingConstraint } = o;
  const msg = CONSTRAINT_MESSAGES[bindingConstraint];

  // Which condition value is smallest?
  const minVal = Math.min(o.condition1_hraReceived, o.condition2_cityCap, o.condition3_rentMinus10pct);
  const isCond1Lowest = o.condition1_hraReceived === minVal;
  const isCond2Lowest = !isCond1Lowest && o.condition2_cityCap === minVal;
  const isCond3Lowest = o.condition3_rentMinus10pct === minVal;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
        <span className="bg-sky-100 text-sky-600 rounded-lg p-1.5 text-sm">🏠</span>
        HRA Optimizer
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        How much rent should you pay to fully utilize your HRA?
        <span className="text-sky-600 font-medium"> Old Regime only.</span>
      </p>

      {/* New metro cities callout */}
      <div className="mb-4 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2.5 text-xs text-sky-700">
        <span className="font-semibold">FY 2026-27 update:</span> 8 cities now qualify for 50% HRA exemption —
        Mumbai, Delhi, Chennai, Kolkata + <span className="font-semibold">Bengaluru, Hyderabad, Pune, Ahmedabad</span> (newly added from 1 Apr 2026).
      </div>

      {/* Current config summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'HRA Received', value: formatINR(o.hraReceived) },
          { label: 'Basic Salary', value: formatINR(o.basicSalary) },
          { label: 'City Rate', value: formatPct(o.cityPct * 100, 0) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-lg p-2.5 text-center">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-sm font-bold text-slate-700 mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* 3 Conditions */}
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
        HRA Exemption = Minimum of 3 conditions
      </p>
      <div className="space-y-2 mb-4">
        <ConditionRow
          number={1}
          label="HRA Received from employer"
          value={o.condition1_hraReceived}
          isBinding={bindingConstraint === 'hra_received'}
          isLowest={isCond1Lowest}
        />
        <ConditionRow
          number={2}
          label={`City cap: ${formatPct(o.cityPct * 100, 0)} × Basic Salary`}
          value={o.condition2_cityCap}
          isBinding={bindingConstraint === 'city_cap'}
          isLowest={isCond2Lowest}
        />
        <ConditionRow
          number={3}
          label="Rent Paid − 10% of Basic"
          value={Math.max(0, o.condition3_rentMinus10pct)}
          isBinding={bindingConstraint === 'rent_paid'}
          isLowest={isCond3Lowest || o.condition3_rentMinus10pct <= 0}
        />
      </div>

      {/* Status message */}
      <div className={`rounded-lg px-3 py-2.5 mb-4 text-xs ${
        msg.color === 'amber' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
        msg.color === 'emerald' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
        'bg-slate-50 border border-slate-200 text-slate-600'
      }`}>
        {msg.icon} {msg.text}
      </div>

      {/* Current vs Max exemption */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-slate-100 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">Current Exemption</p>
          <p className="text-lg font-bold text-slate-700">{formatINR(o.currentExemption)}</p>
          <p className="text-xs text-slate-400">{formatINR(o.currentRentPaid)}/yr rent</p>
        </div>
        <div className={`rounded-lg p-3 text-center border-2 ${
          o.isFullyUtilized ? 'border-emerald-300 bg-emerald-50' : 'border-indigo-300 bg-indigo-50'
        }`}>
          <p className="text-xs text-slate-500">Max Achievable</p>
          <p className={`text-lg font-bold ${o.isFullyUtilized ? 'text-emerald-700' : 'text-indigo-700'}`}>
            {formatINR(o.maxAchievableExemption)}
          </p>
          <p className="text-xs text-slate-400">ceiling for your profile</p>
        </div>
      </div>

      {/* Permanently taxable HRA (city cap issue) */}
      {o.hraPermanentlyTaxable > 0 && (
        <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-600">
          <span className="font-semibold">ℹ️ {formatINR(o.hraPermanentlyTaxable)} of HRA is always taxable</span>
          {' '}— your employer gives more HRA than the city cap ({formatPct(o.cityPct * 100, 0)} × Basic = {formatINR(o.condition2_cityCap)}).
          This portion cannot be exempted regardless of rent paid.
        </div>
      )}

      {/* Recommendation — only if rent needs to increase */}
      {!o.isFullyUtilized && bindingConstraint === 'rent_paid' && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-4 text-white mb-3">
          <p className="text-xs text-indigo-200 uppercase tracking-wide font-medium mb-1">Recommended Monthly Rent</p>
          <p className="text-3xl font-bold">{formatINR(o.optimalMonthlyRent)}<span className="text-base font-normal opacity-75">/mo</span></p>
          <p className="text-sm opacity-85 mt-1">{formatINR(o.optimalAnnualRent)} per year</p>

          <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-xs text-indigo-200">Pay more monthly</p>
              <p className="text-base font-bold">{formatINR(o.additionalMonthlyRent)}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200">Annual tax saved</p>
              <p className="text-base font-bold text-emerald-300">{formatINR(o.additionalTaxSaving)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Fully utilized state */}
      {o.isFullyUtilized && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-4 text-center mb-3">
          <p className="text-emerald-700 font-bold text-base">✅ HRA Fully Optimized!</p>
          <p className="text-xs text-emerald-600 mt-1">
            You are paying the right rent. Full HRA exemption of {formatINR(o.maxAchievableExemption)} is being claimed.
          </p>
        </div>
      )}

      {/* Compliance notes */}
      <div className="space-y-1.5 text-xs text-slate-500">
        {o.requiresLandlordPAN && (
          <p className="flex items-start gap-1.5">
            <span className="text-amber-500 flex-shrink-0">⚠️</span>
            Annual rent exceeds ₹1,00,000 — <span className="font-medium text-slate-700">landlord's PAN is mandatory.</span>
          </p>
        )}
        <p className="flex items-start gap-1.5">
          <span className="flex-shrink-0">📌</span>
          HRA is only available under the <span className="font-medium text-slate-700">Old Tax Regime.</span>
        </p>
        <p className="flex items-start gap-1.5">
          <span className="flex-shrink-0">📌</span>
          FY 2026-27: New IT Rules 2026 require disclosing landlord–tenant relationship when claiming HRA.
        </p>
      </div>
    </div>
  );
}
