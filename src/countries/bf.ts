import type { CountryData } from "../types";

export const BF: CountryData = {
  code: "BF",
  currency: "XOF",
  operators: [
    {
      id: "orange",
      name: "Orange",
      wallet: "Orange Money",
      color: "#FF7900",
      prefixes: ["05", "06", "07", "54", "55", "56", "57", "64", "65", "66", "67", "74", "75", "76", "77"],
      providers: { pawapay: "ORANGE_BFA" },
    },
    {
      id: "moov",
      name: "Moov",
      wallet: "Moov Money",
      color: null,
      prefixes: ["01", "02", "03", "50", "51", "52", "53", "60", "61", "62", "63", "70", "71", "72", "73"],
      providers: { pawapay: "MOOV_BFA" },
    },
    {
      id: "telecel",
      name: "Telecel",
      wallet: null,
      color: null,
      prefixes: ["68", "69", "78", "79"],
    },
  ],
};
