import type { CountryData } from "../types";

export const BJ: CountryData = {
  code: "BJ",
  currency: "XOF",
  legacy: { length: 8, prefix: "01" },
  operators: [
    {
      name: "MTN",
      wallet: "MTN Mobile Money",
      prefixes: [
        "0142", "0146", "0150", "0151", "0152", "0153", "0154", "0156", "0157", "0159",
        "0161", "0162", "0166", "0167", "0169", "0190", "0191", "0196", "0197",
      ],
    },
    {
      name: "Moov",
      wallet: "Moov Money",
      prefixes: ["0145", "0155", "0158", "0160", "0163", "0164", "0165", "0168", "0194", "0195", "0198", "0199"],
    },
    {
      name: "Celtiis",
      wallet: null,
      prefixes: [
        "0120", "0121", "0122", "0123", "0124", "0128", "0129", "0140", "0141", "0143",
        "0144", "0147", "0148", "0149", "0192", "0193",
      ],
    },
  ],
};
