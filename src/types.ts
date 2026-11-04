export type CountryCode = "BF" | "BJ" | "CG" | "CI" | "CM" | "ML" | "NE" | "SN" | "TG";

export interface Operator {
  name: string;
  wallet: string | null;
  prefixes: string[];
}

export interface CountryData {
  code: CountryCode;
  name: string;
  dialCode: string;
  currency: "XAF" | "XOF";
  nationalLength: number;
  mobilePrefixes: string[];
  fixedPrefixes: string[];
  groups: number[];
  operators: Operator[];
}

export type LineType = "mobile" | "fixed";

export interface PhoneInfo {
  country: CountryCode;
  national: string;
  international: string;
  type: LineType;
  operator: string | null;
  wallet: string | null;
}
