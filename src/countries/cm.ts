import type { CountryData } from "../types";

export const CM: CountryData = {
  code: "CM",
  currency: "XAF",
  operators: [
    {
      id: "mtn",
      name: "MTN",
      wallet: "MTN Mobile Money",
      color: "#FFCC01",
      prefixes: ["650", "651", "652", "653", "654", "67", "680", "681", "682", "683"],
      providers: { pawapay: "MTN_MOMO_CMR" },
    },
    {
      id: "orange",
      name: "Orange",
      wallet: "Orange Money",
      color: "#FF7900",
      prefixes: ["640", "641", "642", "655", "656", "657", "658", "659", "69", "686", "687", "688", "689"],
      providers: { pawapay: "ORANGE_CMR" },
    },
    {
      id: "nexttel",
      name: "Nexttel",
      wallet: null,
      color: null,
      prefixes: ["66", "684", "685"],
    },
    {
      id: "camtel",
      name: "Camtel",
      wallet: null,
      color: null,
      prefixes: ["62", "2"],
    },
  ],
};
