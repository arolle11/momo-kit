import type { CountryData } from "../types";

export const TG: CountryData = {
  code: "TG",
  name: "Togo",
  dialCode: "228",
  currency: "XOF",
  nationalLength: 8,
  mobilePrefixes: ["7", "9"],
  fixedPrefixes: ["2"],
  groups: [2, 2, 2, 2],
  operators: [
    { name: "Togocom", wallet: "T-Money", prefixes: ["70", "71", "72", "73", "90", "91", "92", "93"] },
    { name: "Moov", wallet: "Flooz", prefixes: ["78", "79", "96", "97", "98", "99"] },
  ],
};
