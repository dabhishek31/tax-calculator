import {
  TaxYearConfig, TaxSlab, TaxInput, TaxComputation,
  SlabTaxDetail, DeductionBreakdown, ComparisonResult,
  InvestmentSuggestion, Regime, HRAOptimizationResult,
} from '../types/tax';

// ─── Slab computation ────────────────────────────────────────────────────────
function computeSlabTax(income: number, slabs: TaxSlab[]): { details: SlabTaxDetail[]; total: number } {
  const details: SlabTaxDetail[] = [];
  let total = 0;
  for (const slab of slabs) {
    if (income <= slab.from) break;
    const cap = slab.to === Infinity ? income : Math.min(income, slab.to);
    const taxableAmount = cap - slab.from;
    const tax = taxableAmount * slab.rate;
    details.push({ from: slab.from, to: slab.to, rate: slab.rate, taxableAmount, tax });
    total += tax;
  }
  return { details, total };
}

// ─── Surcharge ───────────────────────────────────────────────────────────────
function computeSurcharge(tax: number, taxableIncome: number, regime: Regime, config: TaxYearConfig) {
  let rate = 0;
  for (const slab of config.surcharge) {
    if (taxableIncome > slab.from && taxableIncome <= slab.to) {
      rate = regime === 'new' ? slab.rateNew : slab.rateOld;
      break;
    }
  }
  return { rate, amount: tax * rate };
}

// ─── HRA Exemption ───────────────────────────────────────────────────────────
function computeHRA(basicSalary: number, hraReceived: number, rentPaid: number, cityType: 'metro' | 'non-metro'): number {
  if (!rentPaid || !hraReceived || !basicSalary) return 0;
  const cityPct = cityType === 'metro' ? 0.50 : 0.40;
  return Math.max(0, Math.min(
    hraReceived,
    basicSalary * cityPct,
    rentPaid - basicSalary * 0.10,
  ));
}

// ─── Marginal rate ───────────────────────────────────────────────────────────
function getMarginalRate(taxableIncome: number, slabs: TaxSlab[]): number {
  for (let i = slabs.length - 1; i >= 0; i--) {
    if (taxableIncome > slabs[i].from) return slabs[i].rate * 100;
  }
  return 0;
}

// ─── Helper to assemble TaxComputation from parts ────────────────────────────
function assembleTaxComputation(
  regime: Regime,
  grossIncome: number,
  deductionBreakdown: DeductionBreakdown,
  totalDeductions: number,
  taxableIncome: number,
  slabs: TaxSlab[],
  rebate87AConfig: { incomeLimit: number; maxRebate: number },
  config: TaxYearConfig,
): TaxComputation {
  const { details: slabwiseTax, total: basicTax } = computeSlabTax(taxableIncome, slabs);

  const rebate87A = taxableIncome <= rebate87AConfig.incomeLimit
    ? Math.min(basicTax, rebate87AConfig.maxRebate)
    : 0;

  const taxAfterRebate = Math.max(0, basicTax - rebate87A);
  const { rate: surchargeRate, amount: surcharge } = computeSurcharge(taxAfterRebate, taxableIncome, regime, config);
  const taxBeforeCess = taxAfterRebate + surcharge;
  const cess = taxBeforeCess * config.cess;
  const netTax = taxBeforeCess + cess;

  return {
    regime,
    grossIncome,
    deductionBreakdown,
    totalDeductions,
    taxableIncome,
    slabwiseTax,
    basicTax,
    rebate87A,
    taxAfterRebate,
    surchargeRate,
    surcharge,
    taxBeforeCess,
    cess,
    netTax,
    effectiveRate: grossIncome > 0 ? (netTax / grossIncome) * 100 : 0,
    marginalRate: getMarginalRate(taxableIncome, slabs),
  };
}

// ─── New Regime ───────────────────────────────────────────────────────────────
export function computeNewRegimeTax(input: TaxInput, config: TaxYearConfig): TaxComputation {
  const { newRegime } = config;
  const grossIncome = input.grossSalary + input.otherIncome + input.rentalIncome;

  const standardDeduction = input.employmentType === 'salaried' ? newRegime.standardDeduction : 0;

  // Employer NPS under 80CCD(2) — allowed in new regime at 14% of basic
  const employerNPS = input.employerNPS > 0
    ? input.basicSalary > 0
      ? Math.min(input.employerNPS, input.basicSalary * newRegime.employerNPS_pct)
      : Math.min(input.employerNPS, input.grossSalary * newRegime.employerNPS_pct)
    : 0;

  const deductionBreakdown: DeductionBreakdown = {
    standardDeduction,
    hraExemption: 0,
    section80C: 0,
    section80CCD1B: 0,
    employerNPS,
    section80D_self: 0,
    section80D_parents: 0,
    homeLoanInterest: 0,
    section80TTA_or_TTB: 0,
    otherDeductions: 0,
  };

  const totalDeductions = standardDeduction + employerNPS;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  return assembleTaxComputation(
    'new', grossIncome, deductionBreakdown, totalDeductions,
    taxableIncome, newRegime.slabs, newRegime.rebate87A, config,
  );
}

// ─── Old Regime ───────────────────────────────────────────────────────────────
export function computeOldRegimeTax(input: TaxInput, config: TaxYearConfig): TaxComputation {
  const { oldRegime } = config;
  const limits = oldRegime.deductionLimits;
  const grossIncome = input.grossSalary + input.otherIncome + input.rentalIncome;
  const isSelf = input.taxpayerType === 'senior' || input.taxpayerType === 'superSenior';

  const standardDeduction = input.employmentType === 'salaried' ? oldRegime.standardDeduction : 0;
  const hraExemption = computeHRA(input.basicSalary, input.hraReceived, input.rentPaid, input.cityType);
  const section80C = Math.min(input.section80C, limits.section80C);
  const section80CCD1B = Math.min(input.section80CCD1B, limits.section80CCD1B);

  const employerNPS = input.employerNPS > 0
    ? input.basicSalary > 0
      ? Math.min(input.employerNPS, input.basicSalary * limits.employerNPS_pct_old)
      : Math.min(input.employerNPS, input.grossSalary * limits.employerNPS_pct_old)
    : 0;

  const section80D_self = Math.min(
    input.section80D_self,
    isSelf ? limits.section80D_selfSenior : limits.section80D_selfNonSenior,
  );
  const section80D_parents = Math.min(
    input.section80D_parents,
    input.isSeniorParents ? limits.section80D_parentsSenior : limits.section80D_parentsNonSenior,
  );
  const homeLoanInterest = Math.min(input.homeLoanInterest, limits.section24b_selfOccupied);

  // 80TTA (non-seniors) or 80TTB (seniors)
  const section80TTA_or_TTB = isSelf
    ? Math.min(input.section80TTA, limits.section80TTB)
    : Math.min(input.section80TTA, limits.section80TTA);

  const otherDeductions = Math.max(0, input.otherDeductions);

  const deductionBreakdown: DeductionBreakdown = {
    standardDeduction,
    hraExemption,
    section80C,
    section80CCD1B,
    employerNPS,
    section80D_self,
    section80D_parents,
    homeLoanInterest,
    section80TTA_or_TTB,
    otherDeductions,
  };

  const totalDeductions = Object.values(deductionBreakdown).reduce((a, b) => a + b, 0);
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  const slabs = input.taxpayerType === 'superSenior'
    ? oldRegime.slabsSuperSenior
    : input.taxpayerType === 'senior'
    ? oldRegime.slabsSenior
    : oldRegime.slabsBelow60;

  return assembleTaxComputation(
    'old', grossIncome, deductionBreakdown, totalDeductions,
    taxableIncome, slabs, oldRegime.rebate87A, config,
  );
}

// ─── Compare both regimes ─────────────────────────────────────────────────────
export function compare(input: TaxInput, config: TaxYearConfig): ComparisonResult {
  const newRegime = computeNewRegimeTax(input, config);
  const oldRegime = computeOldRegimeTax(input, config);
  const saving = Math.abs(newRegime.netTax - oldRegime.netTax);
  const betterRegime: Regime = newRegime.netTax <= oldRegime.netTax ? 'new' : 'old';
  return { newRegime, oldRegime, betterRegime, saving };
}

// ─── Investment Suggestions (Old Regime Optimizer) ───────────────────────────
export function computeInvestmentSuggestions(
  input: TaxInput,
  config: TaxYearConfig,
  oldResult: TaxComputation,
): InvestmentSuggestion[] {
  const limits = config.oldRegime.deductionLimits;
  const isSelf = input.taxpayerType === 'senior' || input.taxpayerType === 'superSenior';
  const suggestions: InvestmentSuggestion[] = [];

  function saving(maxInput: TaxInput): number {
    return Math.max(0, oldResult.netTax - computeOldRegimeTax(maxInput, config).netTax);
  }

  // Section 80C
  const current80C = Math.min(input.section80C, limits.section80C);
  const room80C = limits.section80C - current80C;
  if (room80C > 0) {
    suggestions.push({
      section: '80C',
      label: 'PPF, ELSS, LIC, Tuition Fees, Home Loan Principal',
      description: 'Invest in PPF, ELSS mutual funds, LIC premium, children tuition fees, or home loan principal repayment.',
      currentAmount: current80C,
      maxLimit: limits.section80C,
      remainingRoom: room80C,
      potentialTaxSaving: saving({ ...input, section80C: limits.section80C }),
      regime: 'old',
    });
  }

  // Section 80CCD(1B) — NPS self
  const current80CCD1B = Math.min(input.section80CCD1B, limits.section80CCD1B);
  const room80CCD1B = limits.section80CCD1B - current80CCD1B;
  if (room80CCD1B > 0) {
    suggestions.push({
      section: '80CCD(1B)',
      label: 'NPS Self Contribution',
      description: 'Additional NPS contribution over and above the ₹1.5L 80C limit. Great for retirement planning.',
      currentAmount: current80CCD1B,
      maxLimit: limits.section80CCD1B,
      remainingRoom: room80CCD1B,
      potentialTaxSaving: saving({ ...input, section80CCD1B: limits.section80CCD1B }),
      regime: 'old',
    });
  }

  // Section 80D — Self
  const selfD_limit = isSelf ? limits.section80D_selfSenior : limits.section80D_selfNonSenior;
  const current80D_self = Math.min(input.section80D_self, selfD_limit);
  const room80D_self = selfD_limit - current80D_self;
  if (room80D_self > 0) {
    suggestions.push({
      section: '80D (Self)',
      label: 'Health Insurance — Self & Family',
      description: 'Premium paid for health insurance for self, spouse, and children. Preventive health checkup (₹5K) also counts.',
      currentAmount: current80D_self,
      maxLimit: selfD_limit,
      remainingRoom: room80D_self,
      potentialTaxSaving: saving({ ...input, section80D_self: selfD_limit }),
      regime: 'old',
    });
  }

  // Section 80D — Parents
  const parentsD_limit = input.isSeniorParents ? limits.section80D_parentsSenior : limits.section80D_parentsNonSenior;
  const current80D_parents = Math.min(input.section80D_parents, parentsD_limit);
  const room80D_parents = parentsD_limit - current80D_parents;
  if (room80D_parents > 0) {
    suggestions.push({
      section: '80D (Parents)',
      label: 'Health Insurance — Parents',
      description: input.isSeniorParents
        ? 'Parents are 60+: maximum deduction is ₹50,000. Separate from self insurance limit.'
        : 'Health insurance premium for parents. Mark parents as senior to get ₹50,000 limit.',
      currentAmount: current80D_parents,
      maxLimit: parentsD_limit,
      remainingRoom: room80D_parents,
      potentialTaxSaving: saving({ ...input, section80D_parents: parentsD_limit }),
      regime: 'old',
    });
  }

  // Section 24(b) — Home Loan Interest
  const current24b = Math.min(input.homeLoanInterest, limits.section24b_selfOccupied);
  const room24b = limits.section24b_selfOccupied - current24b;
  if (room24b > 0 && input.homeLoanInterest < limits.section24b_selfOccupied) {
    suggestions.push({
      section: '24(b)',
      label: 'Home Loan Interest (Self-Occupied)',
      description: 'Interest paid on home loan for self-occupied property. Up to ₹2L deductible. No limit for let-out property.',
      currentAmount: current24b,
      maxLimit: limits.section24b_selfOccupied,
      remainingRoom: room24b,
      potentialTaxSaving: saving({ ...input, homeLoanInterest: limits.section24b_selfOccupied }),
      regime: 'old',
    });
  }

  return suggestions;
}

// ─── HRA Optimizer ────────────────────────────────────────────────────────────
// Answers: "How much rent should I pay to fully utilize my HRA?"
//
// HRA Exemption = Min of 3 conditions:
//   1. HRA received from employer
//   2. city% × Basic Salary   (50% metro / 40% non-metro)
//   3. Rent Paid − 10% × Basic Salary
//
// To maximize exemption, make Condition 3 ≥ Min(Cond1, Cond2)
// → Optimal Rent = Min(HRA received, city% × Basic) + 10% × Basic
//
// FY 2026-27: 8 metro cities at 50% (Bengaluru, Hyderabad, Pune, Ahmedabad newly added)
export function computeHRAOptimization(input: TaxInput, config: TaxYearConfig, oldResult: TaxComputation): HRAOptimizationResult {
  const hasHRAData = input.basicSalary > 0 && input.hraReceived > 0 && input.employmentType === 'salaried';

  if (!hasHRAData) {
    return {
      hraReceived: input.hraReceived,
      basicSalary: input.basicSalary,
      cityPct: input.cityType === 'metro' ? 0.5 : 0.4,
      currentRentPaid: input.rentPaid,
      condition1_hraReceived: input.hraReceived,
      condition2_cityCap: 0,
      condition3_rentMinus10pct: 0,
      currentExemption: 0,
      bindingConstraint: 'rent_paid',
      maxAchievableExemption: 0,
      hraPermanentlyTaxable: 0,
      optimalAnnualRent: 0,
      optimalMonthlyRent: 0,
      additionalRentNeeded: 0,
      additionalMonthlyRent: 0,
      additionalTaxSaving: 0,
      requiresLandlordPAN: false,
      isFullyUtilized: false,
      hasHRAData: false,
    };
  }

  const cityPct = input.cityType === 'metro' ? 0.50 : 0.40;
  const basic = input.basicSalary;

  // The three conditions
  const cond1 = input.hraReceived;
  const cond2 = basic * cityPct;
  const cond3 = Math.max(0, input.rentPaid - basic * 0.10);

  // Current exemption
  const currentExemption = Math.min(cond1, cond2, cond3);

  // Maximum achievable exemption — ceiling regardless of rent
  const maxAchievableExemption = Math.min(cond1, cond2);

  // HRA that can never be exempted (employer gave more HRA than city cap allows)
  const hraPermanentlyTaxable = Math.max(0, cond1 - cond2);

  // Optimal rent = make condition3 = maxAchievableExemption
  // → rent − 10%×basic = maxAchievableExemption
  // → rent = maxAchievableExemption + 10%×basic
  const optimalAnnualRent = maxAchievableExemption + basic * 0.10;
  const optimalMonthlyRent = optimalAnnualRent / 12;

  const additionalRentNeeded = Math.max(0, optimalAnnualRent - input.rentPaid);
  const additionalMonthlyRent = additionalRentNeeded / 12;

  // Determine what's currently the binding (lowest) constraint
  let bindingConstraint: HRAOptimizationResult['bindingConstraint'];
  const isFullyUtilized = currentExemption >= maxAchievableExemption - 1;

  if (isFullyUtilized) {
    bindingConstraint = 'fully_utilized';
  } else if (cond3 <= cond1 && cond3 <= cond2) {
    bindingConstraint = 'rent_paid';     // rent is too low — user can fix this
  } else if (cond2 <= cond1) {
    bindingConstraint = 'city_cap';      // city cap is lower than HRA received — can't fix
  } else {
    bindingConstraint = 'hra_received';  // HRA from employer is the cap
  }

  // Tax saving from paying optimal rent instead of current
  let additionalTaxSaving = 0;
  if (additionalRentNeeded > 0) {
    const optimizedInput = { ...input, rentPaid: optimalAnnualRent };
    const optimizedTax = computeOldRegimeTax(optimizedInput, config);
    additionalTaxSaving = Math.max(0, oldResult.netTax - optimizedTax.netTax);
  }

  return {
    hraReceived: input.hraReceived,
    basicSalary: basic,
    cityPct,
    currentRentPaid: input.rentPaid,
    condition1_hraReceived: cond1,
    condition2_cityCap: cond2,
    condition3_rentMinus10pct: cond3,
    currentExemption,
    bindingConstraint,
    maxAchievableExemption,
    hraPermanentlyTaxable,
    optimalAnnualRent,
    optimalMonthlyRent,
    additionalRentNeeded,
    additionalMonthlyRent,
    additionalTaxSaving,
    requiresLandlordPAN: optimalAnnualRent > 100000,
    isFullyUtilized,
    hasHRAData: true,
  };
}
