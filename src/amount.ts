export type Currency = "XAF" | "XOF";

const NARROW_NBSP = " ";
const NBSP = " ";

const UNITS = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
];

const TENS: Record<number, string> = {
  10: "dix",
  20: "vingt",
  30: "trente",
  40: "quarante",
  50: "cinquante",
  60: "soixante",
};

const MAX = 999_999_999_999;

function assertAmount(amount: number): void {
  if (!Number.isFinite(amount)) throw new RangeError("Amount must be a finite number");
  if (Math.abs(amount) > MAX) throw new RangeError(`Amount must be between -${MAX} and ${MAX}`);
}

function groupDigits(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
}

export interface FormatAmountOptions {
  display?: "symbol" | "code";
}

export function formatAmount(amount: number, currency: Currency = "XAF", options: FormatAmountOptions = {}): string {
  assertAmount(amount);
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const label = options.display === "code" ? currency : "FCFA";
  return `${sign}${groupDigits(Math.abs(rounded))}${NBSP}${label}`;
}

function below100(n: number, final: boolean): string {
  if (n < 17) return UNITS[n]!;
  if (n < 20) return `dix-${UNITS[n - 10]}`;
  if (n < 70) {
    const tens = Math.floor(n / 10) * 10;
    const unit = n % 10;
    if (unit === 0) return TENS[tens]!;
    if (unit === 1) return `${TENS[tens]} et un`;
    return `${TENS[tens]}-${UNITS[unit]}`;
  }
  if (n < 80) {
    if (n === 71) return "soixante et onze";
    return `soixante-${below100(n - 60, final)}`;
  }
  if (n === 80) return final ? "quatre-vingts" : "quatre-vingt";
  return `quatre-vingt-${below100(n - 80, final)}`;
}

function below1000(n: number, final: boolean): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds === 0) return below100(rest, final);

  const head = hundreds === 1 ? "cent" : `${UNITS[hundreds]} cent`;
  if (rest > 0) return `${head} ${below100(rest, final)}`;
  return hundreds > 1 && final ? `${head}s` : head;
}

function scale(n: number, singular: string, plural: string): string {
  return n === 1 ? `un ${singular}` : `${below1000(n, true)} ${plural}`;
}

function integerToWords(n: number): string {
  if (n === 0) return UNITS[0]!;

  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor(n / 1_000_000) % 1000;
  const thousands = Math.floor(n / 1000) % 1000;
  const rest = n % 1000;

  const parts: string[] = [];
  if (billions) parts.push(scale(billions, "milliard", "milliards"));
  if (millions) parts.push(scale(millions, "million", "millions"));
  if (thousands) parts.push(thousands === 1 ? "mille" : `${below1000(thousands, false)} mille`);
  if (rest) parts.push(below1000(rest, true));
  return parts.join(" ");
}

export function toWords(amount: number): string {
  assertAmount(amount);
  if (!Number.isInteger(amount)) throw new RangeError("Amount must be an integer");
  const words = integerToWords(Math.abs(amount));
  return amount < 0 ? `moins ${words}` : words;
}

export function amountToWords(amount: number): string {
  const rounded = Math.round(amount);
  const words = toWords(rounded);
  const abs = Math.abs(rounded);
  const unit = abs <= 1 ? "franc CFA" : "francs CFA";
  const linker = abs >= 1_000_000 && abs % 1_000_000 === 0 ? "de " : "";
  return `${words} ${linker}${unit}`;
}
