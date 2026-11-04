import type { CountryData } from "../types";

export const CG: CountryData = {
  code: "CG",
  name: "Congo",
  dialCode: "242",
  currency: "XAF",
  nationalLength: 9,
  mobilePrefixes: ["04", "05", "06"],
  fixedPrefixes: ["22"],
  groups: [2, 3, 2, 2],
  operators: [
    { name: "MTN", wallet: "MTN Mobile Money", prefixes: ["06"] },
    { name: "Airtel", wallet: "Airtel Money", prefixes: ["04", "05"] },
  ],
};
