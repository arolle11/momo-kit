import type { CountryData } from "../types";

export const ML: CountryData = {
  code: "ML",
  name: "Mali",
  dialCode: "223",
  currency: "XOF",
  nationalLength: 8,
  mobilePrefixes: ["6", "7", "8", "9"],
  fixedPrefixes: ["20", "21", "44"],
  groups: [2, 2, 2, 2],
  operators: [
    {
      name: "Orange",
      wallet: "Orange Money",
      prefixes: ["7", "82", "83", "84", "850", "851", "852", "853", "854", "90", "91", "92", "93", "94", "44"],
    },
    { name: "Moov", wallet: "Moov Money", prefixes: ["6", "89", "95", "96", "97", "98", "99", "20", "21"] },
  ],
};
