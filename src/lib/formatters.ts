const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "EUR",
  style: "currency",
  maximumFractionDigits: 0,
});

export function formatCurreny(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}
