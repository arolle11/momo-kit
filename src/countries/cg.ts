import type { CountryData } from "../types";

export const CG: CountryData = {
  code: "CG",
  currency: "XAF",
  operators: [
    { name: "MTN", wallet: "MTN Mobile Money", prefixes: ["06"] },
    { name: "Airtel", wallet: "Airtel Money", prefixes: ["04", "05"] },
  ],
};
