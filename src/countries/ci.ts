import type { CountryData } from "../types";

export const CI: CountryData = {
  code: "CI",
  currency: "XOF",
  operators: [
    { name: "Orange", wallet: "Orange Money", prefixes: ["07", "27"] },
    { name: "MTN", wallet: "MTN Mobile Money", prefixes: ["05", "25"] },
    { name: "Moov", wallet: "Moov Money", prefixes: ["01", "21"] },
  ],
};
