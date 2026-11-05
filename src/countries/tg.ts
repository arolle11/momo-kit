import type { CountryData } from "../types";

export const TG: CountryData = {
  code: "TG",
  currency: "XOF",
  operators: [
    {
      id: "togocom",
      name: "Togocom",
      wallet: "T-Money",
      color: null,
      prefixes: ["70", "71", "72", "73", "90", "91", "92", "93"],
    },
    {
      id: "moov",
      name: "Moov",
      wallet: "Flooz",
      color: null,
      prefixes: ["78", "79", "96", "97", "98", "99"],
    },
  ],
};
