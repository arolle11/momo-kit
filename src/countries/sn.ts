import type { CountryData } from "../types";

export const SN: CountryData = {
  code: "SN",
  currency: "XOF",
  operators: [
    { name: "Orange", wallet: "Orange Money", prefixes: ["77", "78", "33"] },
    { name: "Yas", wallet: null, prefixes: ["76"] },
    { name: "Expresso", wallet: null, prefixes: ["70"] },
  ],
};
