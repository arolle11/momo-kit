import type { CountryData } from "../types";

export const BF: CountryData = {
  code: "BF",
  currency: "XOF",
  operators: [
    {
      name: "Orange",
      wallet: "Orange Money",
      prefixes: ["05", "06", "07", "54", "55", "56", "57", "64", "65", "66", "67", "74", "75", "76", "77"],
    },
    {
      name: "Moov",
      wallet: "Moov Money",
      prefixes: ["01", "02", "03", "50", "51", "52", "53", "60", "61", "62", "63", "70", "71", "72", "73"],
    },
    { name: "Telecel", wallet: null, prefixes: ["68", "69", "78", "79"] },
  ],
};
