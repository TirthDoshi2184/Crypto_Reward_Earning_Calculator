export const CURRENCIES = [
  { code: "INR", symbol: "₹", locale: "en-IN", name: "Indian Rupee" },
  { code: "USD", symbol: "$", locale: "en-US", name: "US Dollar" },
  { code: "EUR", symbol: "€", locale: "de-DE", name: "Euro" },
  { code: "GBP", symbol: "£", locale: "en-GB", name: "British Pound" },
];

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

// 1250.5 -> ₹1,250.50
export function formatMoney(value, code) {
  const { locale } = getCurrency(code);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  }).format(value);
}

// Coins can have up to 8 decimals
export function formatCoins(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(value);
}

export function formatPercent(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value) + "%";
}

// Input text -> number. Empty or invalid text gives NaN.
export function toNumber(text) {
  if (text === "" || text === null || text === undefined) return NaN;
  const n = Number(text);
  return Number.isFinite(n) ? n : NaN;
}
