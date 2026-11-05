import type { CountryData } from "../types";

export const CI: CountryData = {
  code: "CI",
  currency: "XOF",
  operators: [
    {
      id: "orange",
      name: "Orange",
      wallet: "Orange Money",
      color: "#FF7900",
      prefixes: ["07", "27"],
      providers: { pawapay: "ORANGE_CIV" },
    },
    {
      id: "mtn",
      name: "MTN",
      wallet: "MTN Mobile Money",
      color: "#FFCC01",
      prefixes: ["05", "25"],
      providers: { pawapay: "MTN_MOMO_CIV" },
    },
    {
      id: "moov",
      name: "Moov",
      wallet: "Moov Money",
      color: null,
      prefixes: ["01", "21"],
      providers: { pawapay: "MOOV_CIV" },
    },
  ],
};
