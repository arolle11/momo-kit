import type { CountryData } from "../types";

export const TG: CountryData = {
  code: "TG",
  currency: "XOF",
  operators: [
    { name: "Togocom", wallet: "T-Money", prefixes: ["70", "71", "72", "73", "90", "91", "92", "93"] },
    { name: "Moov", wallet: "Flooz", prefixes: ["78", "79", "96", "97", "98", "99"] },
  ],
};
