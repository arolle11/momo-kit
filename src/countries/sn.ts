import type { CountryData } from "../types";

export const SN: CountryData = {
  code: "SN",
  name: "Sénégal",
  dialCode: "221",
  currency: "XOF",
  nationalLength: 9,
  mobilePrefixes: ["7"],
  fixedPrefixes: ["33"],
  groups: [2, 3, 2, 2],
  operators: [
    { name: "Orange", wallet: "Orange Money", prefixes: ["77", "78", "33"] },
    { name: "Yas", wallet: null, prefixes: ["76"] },
    { name: "Expresso", wallet: null, prefixes: ["70"] },
  ],
};
