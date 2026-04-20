# 🇮🇳 India Tax Calculator — FY 2026-27

A comprehensive, investment-planning-focused Indian income tax calculator built with React + TypeScript. Compares **New Regime vs Old Regime** in real-time and shows exactly how to reduce your tax through smart investments.

---

## Features

- **Real-time comparison** — New Regime vs Old Regime side by side as you type
- **Full tax breakdown** — Slab-wise computation, rebates, surcharge, cess
- **Investment Optimizer** — Shows how much more to invest in 80C, 80D, NPS etc. to save tax
- **All taxpayer types** — Individual (<60), Senior Citizen (60–79), Super Senior (80+)
- **Salaried & Business** — Standard deduction auto-applied for salaried
- **HRA calculation** — Auto-computes HRA exemption (metro / non-metro)
- **Monthly TDS view** — Shows monthly tax deduction
- **Configurable by design** — One file to update each year (`src/config/taxConfig.ts`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| State | React `useState` / `useMemo` (no external state library) |
| Calculations | Pure TypeScript engine (no library dependencies) |

---

## Project Structure

```
Tax Calculator/
├── src/
│   ├── config/
│   │   └── taxConfig.ts       ← ★ EDIT THIS EVERY YEAR (slabs, limits, rebates)
│   ├── engine/
│   │   └── taxCalculator.ts   ← Pure calculation logic (regime-agnostic)
│   ├── types/
│   │   └── tax.ts             ← All TypeScript interfaces
│   ├── hooks/
│   │   └── useTaxCalculator.ts← State management hook
│   ├── utils/
│   │   └── format.ts          ← Indian currency formatting (₹ / L / Cr)
│   ├── components/
│   │   ├── Header.tsx          ← Year selector
│   │   ├── ProfileCard.tsx     ← Age category + employment type
│   │   ├── IncomeCard.tsx      ← Salary, HRA, other income inputs
│   │   ├── DeductionsCard.tsx  ← All 80C/80D/HRA/24(b) inputs
│   │   ├── ResultsPanel.tsx    ← Right column — all results
│   │   ├── RegimeCard.tsx      ← Per-regime card with breakdown
│   │   ├── InvestmentPlanner.tsx ← Investment optimization suggestions
│   │   └── CurrencyInput.tsx  ← Shared ₹ input component
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── Research.md                ← Full tax research notes (FY 2026-27)
└── README.md
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` in your browser.

---

## How to Update for a New Financial Year

**All tax data lives in one file: `src/config/taxConfig.ts`**

After the Union Budget (typically Feb), do the following:

### Step 1 — Add a new config block

```typescript
// In src/config/taxConfig.ts

export const TAX_CONFIGS: Record<string, TaxYearConfig> = {
  "2026-27": { /* existing */ },

  // Add this block after Budget 2027:
  "2027-28": {
    year: "2027-28",
    label: "FY 2027-28 (AY 2028-29)",

    newRegime: {
      slabs: [
        // Update if Budget changes slabs
        { from: 0,        to: 400000,   rate: 0.00 },
        { from: 400000,   to: 800000,   rate: 0.05 },
        // ...
      ],
      rebate87A: { incomeLimit: 1200000, maxRebate: 60000 }, // Update if changed
      standardDeduction: 75000,     // Update if Budget changes this
      employerNPS_pct: 0.14,        // Update if changed
    },

    oldRegime: {
      standardDeduction: 50000,     // Update if changed
      rebate87A: { incomeLimit: 500000, maxRebate: 12500 },
      slabsBelow60: [ /* update if changed */ ],
      slabsSenior:  [ /* update if changed */ ],
      slabsSuperSenior: [ /* update if changed */ ],
      deductionLimits: {
        section80C: 150000,         // Update if Budget raises this
        section80CCD1B: 50000,
        // ...
      },
    },

    surcharge: [ /* update if changed */ ],
    cess: 0.04,                     // Update if changed
  },
};
```

### Step 2 — Update the default year

```typescript
export const DEFAULT_YEAR = '2027-28'; // Change this
```

That's it. No other file needs to change.

---

## Tax Calculation Logic

The engine (`src/engine/taxCalculator.ts`) computes in this order:

```
Gross Income
  − Standard Deduction (salaried only)
  − HRA Exemption (old regime only)
  − 80C, 80CCD(1B), Employer NPS
  − 80D (self + parents)
  − Section 24(b) home loan interest
  − 80TTA / 80TTB
  − Other deductions
= Taxable Income

Apply slab rates → Basic Tax
  − Rebate u/s 87A (if taxable income within limit)
= Tax after Rebate
  + Surcharge (if taxable income > ₹50L)
= Tax before Cess
  + Health & Education Cess @ 4%
= Net Tax Payable
```

---

## Deductions Supported

| Section | Description | Limit |
|---|---|---|
| Standard Deduction | Salaried / Pensioners | ₹75K (New) / ₹50K (Old) |
| 80C | PPF, ELSS, LIC, Tuition, Home Loan Principal | ₹1,50,000 |
| 80CCD(1B) | NPS Self Contribution | ₹50,000 |
| 80CCD(2) | Employer NPS | 14% salary (New) / 10% (Old) |
| 80D | Health Insurance — Self & Family | ₹25K / ₹50K (senior) |
| 80D | Health Insurance — Parents | ₹25K / ₹50K (senior parents) |
| 24(b) | Home Loan Interest (self-occupied) | ₹2,00,000 |
| HRA | House Rent Allowance | Min(HRA, 50%/40% basic, Rent−10% basic) |
| 80TTA | Savings Interest (non-senior) | ₹10,000 |
| 80TTB | Interest Income (senior) | ₹50,000 |
| Others | 80E, 80G, 80EEA, etc. | User-entered |

---

## Known Limitations

- **Marginal relief on surcharge** not computed (edge case for incomes just above surcharge thresholds)
- **Let-out property** home loan interest (unlimited) should be entered under "Other Deductions"
- **Capital gains** (STCG / LTCG) are not separately handled — include in "Other Income"
- **Presumptive taxation** (44ADA / 44AD) for freelancers not modelled

---

## Research

See [`Research.md`](./Research.md) for the full tax research document covering FY 2026-27 — tax slabs, Budget 2026 changes, Income Tax Act 2025, deduction limits, and regime comparison analysis.
