import type { CountryCode } from "libphonenumber-js";

export type { CountryCode };

export type SupportedCountry = "BF" | "BJ" | "CG" | "CI" | "CM" | "ML" | "NE" | "SN" | "TG";

export type Provider = "pawapay";

export interface Operator {
  id: string;
  name: string;
  wallet: string | null;
  color: string | null;
  prefixes: string[];
  providers?: Partial<Record<Provider, string>>;
}

export interface OperatorInfo {
  country: CountryCode;
  id: string;
  operator: string;
  wallet: string | null;
  color: string | null;
}

export interface CountryData {
  code: SupportedCountry;
  currency: "XAF" | "XOF";
  legacy?: { length: number; prefix: string };
  operators: Operator[];
}

export type LineType = "mobile" | "fixed" | "other";

export interface PhoneInfo {
  country: CountryCode;
  national: string;
  international: string;
  type: LineType;
  operatorId: string | null;
  operator: string | null;
  wallet: string | null;
  color: string | null;
}
