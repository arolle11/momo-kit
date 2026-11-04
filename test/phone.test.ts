import { describe, expect, it } from "vitest";
import { COUNTRIES, detectOperator, format, isValid, normalize, parse } from "../src";
import type { CountryCode } from "../src";

describe("normalize", () => {
  it.each([
    ["677123456", "+237677123456"],
    ["677 12 34 56", "+237677123456"],
    ["6 77 12 34 56", "+237677123456"],
    ["677-12-34-56", "+237677123456"],
    ["677.12.34.56", "+237677123456"],
    ["+237 677 12 34 56", "+237677123456"],
    ["+237677123456", "+237677123456"],
    ["00237677123456", "+237677123456"],
    ["237677123456", "+237677123456"],
    ["(+237) 677 12 34 56", "+237677123456"],
    ["222 23 45 67", "+237222234567"],
  ])("CM %s → %s", (input, expected) => {
    expect(normalize(input, "CM")).toBe(expected);
  });

  it.each([
    "",
    "67712345",
    "6771234567",
    "577123456",
    "+33677123456",
    "67712a456",
    "+",
  ])("CM rejects %j", (input) => {
    expect(normalize(input, "CM")).toBeNull();
    expect(isValid(input, "CM")).toBe(false);
  });

  it("rejects an international number from another country when a country is given", () => {
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
  ])("%s → %s", (input, country) => {
    expect(parse(input)?.country).toBe(country);
  });

  it("needs a country for a local number", () => {
    expect(parse("677123456")).toBeNull();
  });

  it("returns null for an unsupported dial code", () => {
    expect(parse("+33612345678")).toBeNull();
  });
});

describe("detectOperator", () => {
  it.each<[string, CountryCode, string, string | null]>([
    ["670000000", "CM", "MTN", "MTN Mobile Money"],
    ["650000000", "CM", "MTN", "MTN Mobile Money"],
    ["683000000", "CM", "MTN", "MTN Mobile Money"],
    ["690000000", "CM", "Orange", "Orange Money"],
    ["655000000", "CM", "Orange", "Orange Money"],
    ["640000000", "CM", "Orange", "Orange Money"],
    ["686000000", "CM", "Orange", "Orange Money"],
    ["660000000", "CM", "Nexttel", null],
    ["684000000", "CM", "Nexttel", null],
    ["620000000", "CM", "Camtel", null],
    ["222000000", "CM", "Camtel", null],

    ["771234567", "SN", "Orange", "Orange Money"],
    ["781234567", "SN", "Orange", "Orange Money"],
    ["761234567", "SN", "Yas", null],
    ["701234567", "SN", "Expresso", null],

    ["0712345678", "CI", "Orange", "Orange Money"],
    ["0512345678", "CI", "MTN", "MTN Mobile Money"],
    ["0112345678", "CI", "Moov", "Moov Money"],
    ["2722123456", "CI", "Orange", "Orange Money"],

    ["0197123456", "BJ", "MTN", "MTN Mobile Money"],
    ["0161123456", "BJ", "MTN", "MTN Mobile Money"],
    ["0195123456", "BJ", "Moov", "Moov Money"],
    ["0199123456", "BJ", "Moov", "Moov Money"],
    ["0140123456", "BJ", "Celtiis", null],

    ["90123456", "TG", "Togocom", "T-Money"],
    ["70123456", "TG", "Togocom", "T-Money"],
    ["99123456", "TG", "Moov", "Flooz"],
    ["79123456", "TG", "Moov", "Flooz"],

    ["76123456", "BF", "Orange", "Orange Money"],
    ["05123456", "BF", "Orange", "Orange Money"],
    ["70123456", "BF", "Moov", "Moov Money"],
    ["01123456", "BF", "Moov", "Moov Money"],
    ["78123456", "BF", "Telecel", null],

    ["76123456", "ML", "Orange", "Orange Money"],
    ["91123456", "ML", "Orange", "Orange Money"],
    ["85212345", "ML", "Orange", "Orange Money"],
    ["66123456", "ML", "Moov", "Moov Money"],
    ["97123456", "ML", "Moov", "Moov Money"],

    ["83123456", "NE", "Niger Telecoms", null],

    ["061234567", "CG", "MTN", "MTN Mobile Money"],
    ["051234567", "CG", "Airtel", "Airtel Money"],
    ["041234567", "CG", "Airtel", "Airtel Money"],
  ])("%s (%s) → %s", (input, country, operator, wallet) => {
    expect(detectOperator(input, country)).toEqual({ country, operator, wallet });
  });

  it("returns null for a valid number with an unknown prefix", () => {
    expect(isValid("610000000", "CM")).toBe(true);
    expect(detectOperator("610000000", "CM")).toBeNull();
    expect(isValid("96123456", "NE")).toBe(true);
    expect(detectOperator("96123456", "NE")).toBeNull();
  });

  it("returns null for an invalid number", () => {
    expect(detectOperator("123", "CM")).toBeNull();
  });
});

describe("line type", () => {
  it.each<[string, CountryCode, "mobile" | "fixed"]>([
    ["677123456", "CM", "mobile"],
    ["222234567", "CM", "fixed"],
    ["771234567", "SN", "mobile"],
    ["338123456", "SN", "fixed"],
    ["0712345678", "CI", "mobile"],
    ["2722123456", "CI", "fixed"],
    ["0197123456", "BJ", "mobile"],
    ["0121123456", "BJ", "fixed"],
    ["22123456", "TG", "fixed"],
    ["20123456", "ML", "fixed"],
    ["221234567", "CG", "fixed"],
  ])("%s (%s) → %s", (input, country, type) => {
    expect(parse(input, country)?.type).toBe(type);
  });

  it.each<[string, CountryCode]>([
    ["0812345678", "CI"],
    ["0212345678", "BJ"],
    ["5123456", "TG"],
    ["881234567", "SN"],
  ])("rejects %s (%s)", (input, country) => {
    expect(isValid(input, country)).toBe(false);
  });
});

describe("number length", () => {
  it.each(Object.values(COUNTRIES).map((c) => [c.code, c.nationalLength] as const))(
    "%s numbers have %d digits",
    (code, length) => {
      const country = COUNTRIES[code];
      const prefix = country.mobilePrefixes[0]!;
      const valid = prefix.padEnd(length, "1");
      expect(isValid(valid, code)).toBe(true);
      expect(isValid(valid + "1", code)).toBe(false);
      expect(isValid(valid.slice(0, -1), code)).toBe(false);
    },
  );
});

describe("format", () => {
  it.each<[string, CountryCode | undefined, string]>([
    ["+237677123456", undefined, "6 77 12 34 56"],
    ["771234567", "SN", "77 123 45 67"],
    ["0712345678", "CI", "07 12 34 56 78"],
    ["0197123456", "BJ", "01 97 12 34 56"],
    ["90123456", "TG", "90 12 34 56"],
    ["061234567", "CG", "06 123 45 67"],
  ])("%s → %s", (input, country, expected) => {
    expect(format(input, country)).toBe(expected);
  });

  it("formats in international style", () => {
    expect(format("677123456", "CM", "international")).toBe("+237 6 77 12 34 56");
    expect(format("0712345678", "CI", "international")).toBe("+225 07 12 34 56 78");
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
      operator: "Orange",
      wallet: "Orange Money",
    });
  });
});

describe("country data", () => {
  it.each(Object.values(COUNTRIES).map((c) => [c.code, c] as const))("%s is consistent", (code, country) => {
    expect(country.code).toBe(code);
    expect(country.groups.reduce((a, b) => a + b, 0)).toBe(country.nationalLength);
    for (const operator of country.operators) {
      for (const prefix of operator.prefixes) {
        const known = [...country.mobilePrefixes, ...country.fixedPrefixes].some((p) => prefix.startsWith(p) || p.startsWith(prefix));
        expect(known, `${code} ${operator.name} ${prefix}`).toBe(true);
      }
    }
  });
});
