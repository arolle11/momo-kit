import type { CountryData } from "../types";

export const CI: CountryData = {
  code: "CI",
  name: "Côte d'Ivoire",
  dialCode: "225",
  currency: "XOF",
  nationalLength: 10,
  mobilePrefixes: ["01", "05", "07"],
  fixedPrefixes: ["21", "25", "27"],
  groups: [2, 2, 2, 2, 2],
  operators: [
    { name: "Orange", wallet: "Orange Money", prefixes: ["07", "27"] },
    { name: "MTN", wallet: "MTN Mobile Money", prefixes: ["05", "25"] },
    { name: "Moov", wallet: "Moov Money", prefixes: ["01", "21"] },
  ],
};
