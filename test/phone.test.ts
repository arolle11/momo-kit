import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { describe, expect, it } from "vitest";
import { COUNTRIES, detectOperator, format, getProviderCode, isValid, normalize, parse } from "../src";
import type { SupportedCountry } from "../src";

const LENGTH: Record<SupportedCountry, number> = { BF: 8, BJ: 10, CG: 9, CI: 10, CM: 9, ML: 8, NE: 8, SN: 9, TG: 8 };
const DIAL: Record<SupportedCountry, string> = { BF: "226", BJ: "229", CG: "242", CI: "225", CM: "237", ML: "223", NE: "227", SN: "221", TG: "228" };

describe("normalize", () => {
  it.each([
    ["677123456", "+237677123456"],
    ["677 12 34 56", "+237677123456"],
    ["677-12-34-56", "+237677123456"],
    ["677.12.34.56", "+237677123456"],
    ["+237 677 12 34 56", "+237677123456"],
    ["00237677123456", "+237677123456"],
    ["237677123456", "+237677123456"],
    ["(+237) 677 12 34 56", "+237677123456"],
    ["222 23 45 67", "+237222234567"],
  ])("CM %s → %s", (input, expected) => {
    expect(normalize(input, "CM")).toBe(expected);
  });

  it.each(["", "67712345", "6771234567", "577123456", "67712a456", "+", "abc"])("CM rejects %j", (input) => {
    expect(normalize(input, "CM")).toBeNull();
    expect(isValid(input, "CM")).toBe(false);
  });

  it("rejects a number from another country when a country is given", () => {
    expect(normalize("+221771234567", "CM")).toBeNull();
  });
});

describe("country detection", () => {
  it.each([
    ["+237 677 12 34 56", "CM"],
    ["+221 77 123 45 67", "SN"],
    ["+225 07 12 34 56 78", "CI"],
    ["00229 01 97 12 34 56", "BJ"],
    ["+228 90 12 34 56", "TG"],
    ["+226 70 12 34 56", "BF"],
    ["+223 76 12 34 56", "ML"],
    ["+227 96 12 34 56", "NE"],
    ["+242 06 612 34 56", "CG"],
    ["237 655 12 34 56", "CM"],
    ["2250712345678", "CI"],
  ])("%s → %s", (input, country) => {
    expect(parse(input)?.country).toBe(country);
  });

  it("works for any country, without operator data", () => {
    expect(parse("+33 6 12 34 56 78")).toMatchObject({ country: "FR", type: "mobile", operator: null, wallet: null });
    expect(parse("+234 803 123 4567")).toMatchObject({ country: "NG", type: "mobile", operator: null });
  });

  it("needs a country for a local number", () => {
    expect(parse("677123456")).toBeNull();
  });
});

describe("legacy numbers", () => {
  it.each([
    ["+229 97 12 34 56", "+2290197123456"],
    ["0022966123456", "+2290166123456"],
    ["229 95 12 34 56", "+2290195123456"],
  ])("upgrades an 8-digit Bénin number: %s → %s", (input, expected) => {
    expect(normalize(input)).toBe(expected);
  });

  it("upgrades a local 8-digit Bénin number", () => {
    expect(parse("97 12 34 56", "BJ")).toMatchObject({ international: "+2290197123456", operator: "MTN" });
  });

  it("keeps rejecting old 8-digit Côte d'Ivoire numbers", () => {
    expect(isValid("07080910", "CI")).toBe(false);
  });
});

describe("detectOperator", () => {
  it.each<[string, SupportedCountry, string, string | null]>([
    ["670000000", "CM", "MTN", "MTN Mobile Money"],
    ["650000000", "CM", "MTN", "MTN Mobile Money"],
    ["683000000", "CM", "MTN", "MTN Mobile Money"],
    ["690000000", "CM", "Orange", "Orange Money"],
    ["655000000", "CM", "Orange", "Orange Money"],
    ["686000000", "CM", "Orange", "Orange Money"],
    ["660000000", "CM", "Nexttel", null],
    ["620000000", "CM", "Camtel", null],

    ["771234567", "SN", "Orange", "Orange Money"],
    ["781234567", "SN", "Orange", "Orange Money"],
    ["761234567", "SN", "Yas", null],
    ["701234567", "SN", "Expresso", null],

    ["0712345678", "CI", "Orange", "Orange Money"],
    ["0512345678", "CI", "MTN", "MTN Mobile Money"],
    ["0112345678", "CI", "Moov", "Moov Money"],

    ["0197123456", "BJ", "MTN", "MTN Mobile Money"],
    ["0161123456", "BJ", "MTN", "MTN Mobile Money"],
    ["0195123456", "BJ", "Moov", "Moov Money"],
    ["0140123456", "BJ", "Celtiis", null],

    ["90123456", "TG", "Togocom", "T-Money"],
    ["99123456", "TG", "Moov", "Flooz"],

    ["76123456", "BF", "Orange", "Orange Money"],
    ["05123456", "BF", "Orange", "Orange Money"],
    ["70123456", "BF", "Moov", "Moov Money"],
    ["78123456", "BF", "Telecel", null],

    ["76123456", "ML", "Orange", "Orange Money"],
    ["85212345", "ML", "Orange", "Orange Money"],
    ["66123456", "ML", "Moov", "Moov Money"],

    ["83123456", "NE", "Niger Telecoms", null],

    ["061234567", "CG", "MTN", "MTN Mobile Money"],
    ["051234567", "CG", "Airtel", "Airtel Money"],
  ])("%s (%s) → %s", (input, country, operator, wallet) => {
    expect(detectOperator(input, country)).toMatchObject({ country, operator, wallet });
  });

  it("returns null when the prefix is not in the data", () => {
    expect(isValid("96123456", "NE")).toBe(true);
    expect(detectOperator("96123456", "NE")).toBeNull();
  });

  it("returns null for an invalid number", () => {
    expect(detectOperator("123", "CM")).toBeNull();
  });
});

describe("wallet", () => {
  it("is only given for mobile lines", () => {
    expect(parse("+221338123456")).toMatchObject({ type: "fixed", operator: "Orange", wallet: null });
    expect(parse("+237222234567")).toMatchObject({ type: "fixed", operator: "Camtel", wallet: null });
    expect(parse("+221771234567")).toMatchObject({ type: "mobile", wallet: "Orange Money" });
  });
});

describe("format", () => {
  it.each<[string, SupportedCountry | undefined, string]>([
    ["+237677123456", undefined, "6 77 12 34 56"],
    ["771234567", "SN", "77 123 45 67"],
    ["0197123456", "BJ", "01 97 12 34 56"],
    ["90123456", "TG", "90 12 34 56"],
  ])("%s → %s", (input, country, expected) => {
    expect(format(input, country)).toBe(expected);
  });

  it("formats in international style", () => {
    expect(format("677123456", "CM", "international")).toBe("+237 6 77 12 34 56");
  });

  it("returns null for an invalid number", () => {
    expect(format("12", "CM")).toBeNull();
  });
});

describe("parse", () => {
  it("returns every detail of a mobile number", () => {
    expect(parse("00237 699 00 00 00")).toEqual({
      country: "CM",
      national: "699000000",
      international: "+237699000000",
      type: "mobile",
      operatorId: "orange",
      operator: "Orange",
      wallet: "Orange Money",
      color: "#FF7900",
    });
  });
});

describe("operator identity", () => {
  it("returns a stable id and the brand color", () => {
    expect(detectOperator("+237 677 12 34 56")).toEqual({
      country: "CM",
      id: "mtn",
      operator: "MTN",
      wallet: "MTN Mobile Money",
      color: "#FFCC01",
    });
    expect(detectOperator("+242 05 123 45 67")).toMatchObject({ id: "airtel", color: "#ED1C24" });
    expect(detectOperator("90 12 34 56", "TG")).toMatchObject({ id: "togocom", color: null });
  });

  it("uses the same id for an operator in every country", () => {
    expect(detectOperator("+221771234567")?.id).toBe("orange");
    expect(detectOperator("+2250712345678")?.id).toBe("orange");
    expect(detectOperator("+22676123456")?.id).toBe("orange");
  });
});

describe("getProviderCode", () => {
  it.each([
    ["+237 677 12 34 56", "MTN_MOMO_CMR"],
    ["+237 699 00 00 00", "ORANGE_CMR"],
    ["+225 05 12 34 56 78", "MTN_MOMO_CIV"],
    ["+225 07 12 34 56 78", "ORANGE_CIV"],
    ["+225 01 12 34 56 78", "MOOV_CIV"],
    ["+221 77 123 45 67", "ORANGE_SEN"],
    ["+221 76 123 45 67", "FREE_SEN"],
    ["+229 01 97 12 34 56", "MTN_MOMO_BEN"],
    ["+229 01 95 12 34 56", "MOOV_BEN"],
    ["+229 97 12 34 56", "MTN_MOMO_BEN"],
    ["+226 76 12 34 56", "ORANGE_BFA"],
    ["+226 70 12 34 56", "MOOV_BFA"],
    ["+242 06 612 34 56", "MTN_MOMO_COG"],
    ["+242 05 123 45 67", "AIRTEL_COG"],
  ])("pawapay %s → %s", (input, code) => {
    expect(getProviderCode(input, "pawapay")).toBe(code);
  });

  it("accepts a local number with its country", () => {
    expect(getProviderCode("677 12 34 56", "pawapay", "CM")).toBe("MTN_MOMO_CMR");
  });

  it("returns null when the provider does not support the operator", () => {
    expect(getProviderCode("+237 660 00 00 00", "pawapay")).toBeNull();
    expect(getProviderCode("+228 90 12 34 56", "pawapay")).toBeNull();
    expect(getProviderCode("+221 70 123 45 67", "pawapay")).toBeNull();
  });

  it("returns null for fixed lines and invalid numbers", () => {
    expect(getProviderCode("+221 33 812 34 56", "pawapay")).toBeNull();
    expect(getProviderCode("123", "pawapay", "CM")).toBeNull();
  });
});

describe("operator data", () => {
  const rows = Object.values(COUNTRIES).flatMap((country) =>
    country.operators.flatMap((operator) =>
      operator.prefixes.map((prefix) => [country.code, operator.name, prefix] as const),
    ),
  );

  it("has a valid color and id for every operator", () => {
    for (const country of Object.values(COUNTRIES)) {
      for (const operator of country.operators) {
        expect(operator.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
        if (operator.color) expect(operator.color).toMatch(/^#[0-9A-F]{6}$/);
      }
    }
  });

  it.each(rows)("%s %s %s matches real numbers", (code, operator, prefix) => {
    const length = LENGTH[code];
    const candidates = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => prefix + d.repeat(length - prefix.length));
    const valid = candidates.some((n) => parsePhoneNumberFromString(`+${DIAL[code]}${n}`)?.isValid());
    expect(valid, `${code} ${operator} ${prefix}`).toBe(true);
  });
});
