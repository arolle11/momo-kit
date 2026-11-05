import type { CountryData } from "../types";

export const CG: CountryData = {
  code: "CG",
  currency: "XAF",
  operators: [
    {
      id: "mtn",
      name: "MTN",
      wallet: "MTN Mobile Money",
      color: "#FFCC01",
      prefixes: ["06"],
      providers: { pawapay: "MTN_MOMO_COG" },
    },
    {
      id: "airtel",
      name: "Airtel",
      wallet: "Airtel Money",
      color: "#ED1C24",
      prefixes: ["04", "05"],
      providers: { pawapay: "AIRTEL_COG" },
    },
  ],
};
