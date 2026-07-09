/** Monetary value with currency. Domain uses integer cents internally. */
export type Currency = "USD";

export interface Money {
  readonly amountCents: number;
  readonly currency: Currency;
}

export function usd(amountCents: number): Money {
  return { amountCents: Math.round(amountCents), currency: "USD" };
}

export function moneyFromDollars(dollars: number): Money {
  return usd(Math.round(dollars * 100));
}

export function moneyToDollars(money: Money): number {
  return money.amountCents / 100;
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new Error("Currency mismatch");
  return usd(a.amountCents + b.amountCents);
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new Error("Currency mismatch");
  return usd(a.amountCents - b.amountCents);
}

export function multiplyMoney(money: Money, factor: number): Money {
  return usd(Math.round(money.amountCents * factor));
}

export function formatMoney(money: Money): string {
  const sign = money.amountCents < 0 ? "-" : "";
  const abs = Math.abs(money.amountCents);
  const dollars = Math.floor(abs / 100);
  const cents = abs % 100;
  return `${sign}$${dollars}.${cents.toString().padStart(2, "0")}`;
}
