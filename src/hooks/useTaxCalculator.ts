import { useState, useMemo } from 'react';
import { TaxInput } from '../types/tax';
import { TAX_CONFIGS, DEFAULT_YEAR } from '../config/taxConfig';
import { compare, computeInvestmentSuggestions, computeHRAOptimization, computeOldRegimeTax } from '../engine/taxCalculator';

const DEFAULT_INPUT: TaxInput = {
  taxYear: DEFAULT_YEAR,
  taxpayerType: 'individual',
  employmentType: 'salaried',
  grossSalary: 0,
  basicSalary: 0,
  hraReceived: 0,
  otherIncome: 0,
  rentalIncome: 0,
  rentPaid: 0,
  cityType: 'metro',
  section80C: 0,
  section80CCD1B: 0,
  employerNPS: 0,
  section80D_self: 0,
  section80D_parents: 0,
  isSeniorParents: false,
  homeLoanInterest: 0,
  section80TTA: 0,
  otherDeductions: 0,
};

export function useTaxCalculator() {
  const [input, setInput] = useState<TaxInput>(DEFAULT_INPUT);

  const config = useMemo(() => TAX_CONFIGS[input.taxYear], [input.taxYear]);

  const result = useMemo(() => {
    if (!config || input.grossSalary <= 0) return null;
    return compare(input, config);
  }, [input, config]);

  const suggestions = useMemo(() => {
    if (!result || !config) return [];
    return computeInvestmentSuggestions(input, config, result.oldRegime);
  }, [input, config, result]);

  // HRA optimization runs even without income entered — only needs HRA + basic
  const hraOptimization = useMemo(() => {
    if (!config) return null;
    // Use actual old regime result if available, otherwise compute from HRA input alone
    const oldResult = result
      ? result.oldRegime
      : computeOldRegimeTax(input, config);
    return computeHRAOptimization(input, config, oldResult);
  }, [input, config, result]);

  function update(patch: Partial<TaxInput>) {
    setInput(prev => ({ ...prev, ...patch }));
  }

  return { input, update, config, result, suggestions, hraOptimization };
}
