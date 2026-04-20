const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const NUM_IN = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export function formatINR(amount: number): string {
  return INR.format(Math.round(amount));
}

export function formatNum(amount: number): string {
  return NUM_IN.format(Math.round(amount));
}

export function formatPct(rate: number, decimals = 1): string {
  return `${rate.toFixed(decimals)}%`;
}

/** Convert raw number to short label: ₹12.5L, ₹1.2Cr */
export function formatShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}
