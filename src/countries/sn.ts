import type { CountryData } from "../types";

export const SN: CountryData = {
  code: "SN",
  currency: "XOF",
  operators: [
    {
      id: "orange",
      name: "Orange",
      wallet: "Orange Money",
      color: "#FF7900",
      prefixes: ["77", "78", "33"],
      providers: { pawapay: "ORANGE_SEN" },
    },
    {
      id: "yas",
      name: "Yas",
      wallet: null,
      color: null,
      prefixes: ["76"],
      providers: { pawapay: "FREE_SEN" },
    },
    {
      id: "expresso",
      name: "Expresso",
      wallet: null,
      color: null,
      prefixes: ["70"],
    },
  ],
};
