// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                    TAX CONFIGURATION — EDIT THIS FILE                   ║
// ║                                                                          ║
// ║  To add a new financial year, copy the "2026-27" block below,           ║
// ║  paste it as a new key (e.g. "2027-28"), and update the values.         ║
// ║  No other file needs to change.                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { TaxYearConfig } from '../types/tax';

// ── Metro cities per financial year (50% HRA city cap) ───────────────────────
// FY 2026-27: 8 cities (4 new cities added under Income Tax Rules 2026)
// Update this list if Budget/Rules add more cities in future years.
export const METRO_CITIES_BY_YEAR: Record<string, string[]> = {
  "2026-27": [
    "Mumbai", "Delhi", "Chennai", "Kolkata",          // original 4 metros
    "Bengaluru", "Hyderabad", "Pune", "Ahmedabad",    // NEW from 1 Apr 2026
  ],
  "2027-28": [
    "Mumbai", "Delhi", "Chennai", "Kolkata",
    "Bengaluru", "Hyderabad", "Pune", "Ahmedabad",
  ],
};

export const TAX_CONFIGS: Record<string, TaxYearConfig> = {

  // ── FY 2026-27 (AY 2027-28) ─────────────────────────────────────────────
  // Source: Income Tax Act 2025 (effective 1 Apr 2026) + Union Budget 2026
  // No slab changes from FY 2025-26. New IT Act 2025 comes into force.
  "2026-27": {
    year: "2026-27",
    label: "FY 2026-27 (AY 2027-28)",

    newRegime: {
      // Default regime under Section 115BAC | Income Tax Act 2025
      slabs: [
        { from: 0,        to: 400000,   rate: 0.00 },
        { from: 400000,   to: 800000,   rate: 0.05 },
        { from: 800000,   to: 1200000,  rate: 0.10 },
        { from: 1200000,  to: 1600000,  rate: 0.15 },
        { from: 1600000,  to: 2000000,  rate: 0.20 },
        { from: 2000000,  to: 2400000,  rate: 0.25 },
        { from: 2400000,  to: Infinity, rate: 0.30 },
      ],
      // Sec 87A: taxable income ≤ ₹12L → full rebate up to ₹60K
      rebate87A: { incomeLimit: 1200000, maxRebate: 60000 },
      // Standard deduction for salaried & pensioners
      standardDeduction: 75000,
      // Employer NPS contribution (Sec 80CCD(2)) — allowed in new regime
      employerNPS_pct: 0.14, // 14% of basic salary
    },

    oldRegime: {
      standardDeduction: 50000, // salaried & pensioners
      // Old regime: Sec 87A — income ≤ ₹5L → rebate up to ₹12,500
      rebate87A: { incomeLimit: 500000, maxRebate: 12500 },

      // Individuals below 60 years
      slabsBelow60: [
        { from: 0,       to: 250000,   rate: 0.00 },
        { from: 250000,  to: 500000,   rate: 0.05 },
        { from: 500000,  to: 1000000,  rate: 0.20 },
        { from: 1000000, to: Infinity, rate: 0.30 },
      ],
      // Senior citizens: 60–79 years
      slabsSenior: [
        { from: 0,       to: 300000,   rate: 0.00 },
        { from: 300000,  to: 500000,   rate: 0.05 },
        { from: 500000,  to: 1000000,  rate: 0.20 },
        { from: 1000000, to: Infinity, rate: 0.30 },
      ],
      // Super senior citizens: 80+ years
      slabsSuperSenior: [
        { from: 0,       to: 500000,   rate: 0.00 },
        { from: 500000,  to: 1000000,  rate: 0.20 },
        { from: 1000000, to: Infinity, rate: 0.30 },
      ],

      deductionLimits: {
        section80C:              150000, // PPF, ELSS, LIC, tuition, home loan principal
        section80CCD1B:           50000, // NPS self-contribution (over & above 80C)
        employerNPS_pct_old:       0.10, // 10% of basic salary (old regime cap)
        section80D_selfNonSenior:  25000,
        section80D_selfSenior:     50000,
        section80D_parentsNonSenior: 25000,
        section80D_parentsSenior:  50000,
        section24b_selfOccupied:  200000, // home loan interest, self-occupied
        section80TTA:              10000, // savings a/c interest (non-seniors)
        section80TTB:              50000, // interest income (seniors — FD/RD/savings)
      },
    },

    // Surcharge on income tax (applied on tax amount, not income)
    surcharge: [
      { from: 5000000,  to: 10000000, rateNew: 0.10, rateOld: 0.10 },
      { from: 10000000, to: 20000000, rateNew: 0.15, rateOld: 0.15 },
      { from: 20000000, to: 50000000, rateNew: 0.25, rateOld: 0.25 },
      { from: 50000000, to: Infinity, rateNew: 0.25, rateOld: 0.37 }, // new regime capped at 25%
    ],

    cess: 0.04, // 4% Health & Education Cess on (tax + surcharge)
  },

  // ── FY 2027-28 (AY 2028-29) ─────────────────────────────────────────────
  // ACTION: Update these values after Union Budget 2027 (Feb 2027)
  "2027-28": {
    year: "2027-28",
    label: "FY 2027-28 (AY 2028-29) — Update after Budget 2027",

    newRegime: {
      slabs: [
        { from: 0,        to: 400000,   rate: 0.00 },
        { from: 400000,   to: 800000,   rate: 0.05 },
        { from: 800000,   to: 1200000,  rate: 0.10 },
        { from: 1200000,  to: 1600000,  rate: 0.15 },
        { from: 1600000,  to: 2000000,  rate: 0.20 },
        { from: 2000000,  to: 2400000,  rate: 0.25 },
        { from: 2400000,  to: Infinity, rate: 0.30 },
      ],
      rebate87A: { incomeLimit: 1200000, maxRebate: 60000 },
      standardDeduction: 75000,
      employerNPS_pct: 0.14,
    },

    oldRegime: {
      standardDeduction: 50000,
      rebate87A: { incomeLimit: 500000, maxRebate: 12500 },
      slabsBelow60: [
        { from: 0,       to: 250000,   rate: 0.00 },
        { from: 250000,  to: 500000,   rate: 0.05 },
        { from: 500000,  to: 1000000,  rate: 0.20 },
        { from: 1000000, to: Infinity, rate: 0.30 },
      ],
      slabsSenior: [
        { from: 0,       to: 300000,   rate: 0.00 },
        { from: 300000,  to: 500000,   rate: 0.05 },
        { from: 500000,  to: 1000000,  rate: 0.20 },
        { from: 1000000, to: Infinity, rate: 0.30 },
      ],
      slabsSuperSenior: [
        { from: 0,       to: 500000,   rate: 0.00 },
        { from: 500000,  to: 1000000,  rate: 0.20 },
        { from: 1000000, to: Infinity, rate: 0.30 },
      ],
      deductionLimits: {
        section80C:              150000,
        section80CCD1B:           50000,
        employerNPS_pct_old:       0.10,
        section80D_selfNonSenior:  25000,
        section80D_selfSenior:     50000,
        section80D_parentsNonSenior: 25000,
        section80D_parentsSenior:  50000,
        section24b_selfOccupied:  200000,
        section80TTA:              10000,
        section80TTB:              50000,
      },
    },

    surcharge: [
      { from: 5000000,  to: 10000000, rateNew: 0.10, rateOld: 0.10 },
      { from: 10000000, to: 20000000, rateNew: 0.15, rateOld: 0.15 },
      { from: 20000000, to: 50000000, rateNew: 0.25, rateOld: 0.25 },
      { from: 50000000, to: Infinity, rateNew: 0.25, rateOld: 0.37 },
    ],

    cess: 0.04,
  },
};

export const DEFAULT_YEAR = '2026-27';
export const AVAILABLE_YEARS = Object.keys(TAX_CONFIGS);
