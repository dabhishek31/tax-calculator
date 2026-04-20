// ─── Taxpayer Profile ───────────────────────────────────────────────────────
export type TaxpayerType = 'individual' | 'senior' | 'superSenior';
export type EmploymentType = 'salaried' | 'business';
export type CityType = 'metro' | 'non-metro';
export type Regime = 'new' | 'old';

// ─── Config Types (edit taxConfig.ts each year) ──────────────────────────────
export interface TaxSlab {
  from: number;
  to: number; // use Infinity for top bracket
  rate: number; // e.g. 0.20 for 20%
}

export interface SurchargeSlab {
  from: number;
  to: number;
  rateNew: number;
  rateOld: number;
}

export interface Rebate87A {
  incomeLimit: number;
  maxRebate: number;
}

export interface OldRegimeDeductionLimits {
  section80C: number;
  section80CCD1B: number;
  employerNPS_pct_old: number; // 10% of basic salary
  section80D_selfNonSenior: number;
  section80D_selfSenior: number;
  section80D_parentsNonSenior: number;
  section80D_parentsSenior: number;
  section24b_selfOccupied: number;
  section80TTA: number;
  section80TTB: number;
}

export interface OldRegimeConfig {
  standardDeduction: number;
  slabsBelow60: TaxSlab[];
  slabsSenior: TaxSlab[];
  slabsSuperSenior: TaxSlab[];
  rebate87A: Rebate87A;
  deductionLimits: OldRegimeDeductionLimits;
}

export interface NewRegimeConfig {
  slabs: TaxSlab[];
  rebate87A: Rebate87A;
  standardDeduction: number;
  employerNPS_pct: number; // 14% of basic salary
}

export interface TaxYearConfig {
  year: string;
  label: string;
  newRegime: NewRegimeConfig;
  oldRegime: OldRegimeConfig;
  surcharge: SurchargeSlab[];
  cess: number;
}

// ─── User Input ──────────────────────────────────────────────────────────────
export interface TaxInput {
  taxYear: string;
  taxpayerType: TaxpayerType;
  employmentType: EmploymentType;
  // Income
  grossSalary: number;
  basicSalary: number;
  hraReceived: number;
  otherIncome: number;
  rentalIncome: number;
  // HRA details
  rentPaid: number;
  cityType: CityType;
  // Deductions (Old Regime — used for comparison)
  section80C: number;
  section80CCD1B: number;
  employerNPS: number;
  section80D_self: number;
  section80D_parents: number;
  isSeniorParents: boolean;
  homeLoanInterest: number;
  section80TTA: number;
  otherDeductions: number;
}

// ─── Calculation Output ──────────────────────────────────────────────────────
export interface SlabTaxDetail {
  from: number;
  to: number;
  rate: number;
  taxableAmount: number;
  tax: number;
}

export interface DeductionBreakdown {
  standardDeduction: number;
  hraExemption: number;
  section80C: number;
  section80CCD1B: number;
  employerNPS: number;
  section80D_self: number;
  section80D_parents: number;
  homeLoanInterest: number;
  section80TTA_or_TTB: number;
  otherDeductions: number;
}

export interface TaxComputation {
  regime: Regime;
  grossIncome: number;
  deductionBreakdown: DeductionBreakdown;
  totalDeductions: number;
  taxableIncome: number;
  slabwiseTax: SlabTaxDetail[];
  basicTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  surchargeRate: number;
  surcharge: number;
  taxBeforeCess: number;
  cess: number;
  netTax: number;
  effectiveRate: number;
  marginalRate: number;
}

export interface ComparisonResult {
  newRegime: TaxComputation;
  oldRegime: TaxComputation;
  betterRegime: Regime;
  saving: number;
}

export interface InvestmentSuggestion {
  section: string;
  label: string;
  description: string;
  currentAmount: number;
  maxLimit: number;
  remainingRoom: number;
  potentialTaxSaving: number;
  regime: 'old' | 'both';
}

// ─── HRA Optimization ────────────────────────────────────────────────────────
export type HRABindingConstraint = 'hra_received' | 'city_cap' | 'rent_paid' | 'fully_utilized';

export interface HRAOptimizationResult {
  // Inputs
  hraReceived: number;
  basicSalary: number;
  cityPct: number;           // 0.50 metro / 0.40 non-metro
  currentRentPaid: number;

  // Condition values
  condition1_hraReceived: number;
  condition2_cityCap: number;  // city% × basic
  condition3_rentMinus10pct: number; // rent − 10% basic

  // Current state
  currentExemption: number;
  bindingConstraint: HRABindingConstraint;

  // Ceiling — maximum achievable regardless of rent
  maxAchievableExemption: number; // min(HRA received, city cap)
  hraPermanentlyTaxable: number;  // HRA exceeding city cap — always taxable

  // Optimization target
  optimalAnnualRent: number;   // rent to pay to hit max achievable exemption
  optimalMonthlyRent: number;
  additionalRentNeeded: number; // optimalAnnualRent - currentRentPaid
  additionalMonthlyRent: number;

  // Tax impact of optimization (old regime)
  additionalTaxSaving: number;

  // Compliance
  requiresLandlordPAN: boolean;  // rent > ₹1L/year
  isFullyUtilized: boolean;
  hasHRAData: boolean;           // false if basic or HRA not entered
}
