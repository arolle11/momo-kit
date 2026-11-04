import type { CountryData } from "../types";

export const CM: CountryData = {
  code: "CM",
  currency: "XAF",
  operators: [
    {
      name: "MTN",
      wallet: "MTN Mobile Money",
      prefixes: ["650", "651", "652", "653", "654", "67", "680", "681", "682", "683"],
    },
    {
      name: "Orange",
      wallet: "Orange Money",
      prefixes: ["640", "641", "642", "655", "656", "657", "658", "659", "69", "686", "687", "688", "689"],
    },
    { name: "Nexttel", wallet: null, prefixes: ["66", "684", "685"] },
    { name: "Camtel", wallet: null, prefixes: ["62", "2"] },
  ],
};
