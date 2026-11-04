import { describe, expect, it } from "vitest";
import { amountToWords, formatAmount, toWords } from "../src";

const N = " ";
const S = " ";

describe("formatAmount", () => {
  it.each([
    [0, `0${S}FCFA`],
    [500, `500${S}FCFA`],
    [15000, `15${N}000${S}FCFA`],
    [1250000, `1${N}250${N}000${S}FCFA`],
    [-2500, `-2${N}500${S}FCFA`],
    [1999.6, `2${N}000${S}FCFA`],
  ])("%d → %j", (amount, expected) => {
    expect(formatAmount(amount)).toBe(expected);
  });

  it("can display the ISO code", () => {
    expect(formatAmount(15000, "XOF", { display: "code" })).toBe(`15${N}000${S}XOF`);
    expect(formatAmount(15000, "XAF", { display: "code" })).toBe(`15${N}000${S}XAF`);
  });

  it("rejects non finite amounts", () => {
    expect(() => formatAmount(Number.NaN)).toThrow(RangeError);
    expect(() => formatAmount(Infinity)).toThrow(RangeError);
  });
});

describe("toWords", () => {
  it.each([
    [0, "zéro"],
    [1, "un"],
    [16, "seize"],
    [17, "dix-sept"],
    [21, "vingt et un"],
    [22, "vingt-deux"],
    [30, "trente"],
    [41, "quarante et un"],
    [61, "soixante et un"],
    [70, "soixante-dix"],
    [71, "soixante et onze"],
    [72, "soixante-douze"],
    [77, "soixante-dix-sept"],
    [80, "quatre-vingts"],
    [81, "quatre-vingt-un"],
    [90, "quatre-vingt-dix"],
    [91, "quatre-vingt-onze"],
    [99, "quatre-vingt-dix-neuf"],
    [100, "cent"],
    [101, "cent un"],
    [200, "deux cents"],
    [201, "deux cent un"],
    [280, "deux cent quatre-vingts"],
    [1000, "mille"],
    [1001, "mille un"],
    [2000, "deux mille"],
    [15000, "quinze mille"],
    [21000, "vingt et un mille"],
    [80000, "quatre-vingt mille"],
    [200000, "deux cent mille"],
    [250500, "deux cent cinquante mille cinq cents"],
    [1_000_000, "un million"],
    [2_000_000, "deux millions"],
    [80_000_000, "quatre-vingts millions"],
    [200_000_000, "deux cents millions"],
    [1_250_000, "un million deux cent cinquante mille"],
    [1_000_000_000, "un milliard"],
    [3_000_000_001, "trois milliards un"],
    [-45, "moins quarante-cinq"],
  ])("%d → %s", (amount, expected) => {
    expect(toWords(amount)).toBe(expected);
  });

  it("rejects decimals", () => {
    expect(() => toWords(1.5)).toThrow(RangeError);
  });

  it("rejects amounts that are too large", () => {
    expect(() => toWords(1_000_000_000_000)).toThrow(RangeError);
  });
});

describe("amountToWords", () => {
  it.each([
    [0, "zéro franc CFA"],
    [1, "un franc CFA"],
    [2, "deux francs CFA"],
    [15000, "quinze mille francs CFA"],
    [1_000_000, "un million de francs CFA"],
    [5_000_000, "cinq millions de francs CFA"],
    [1_500_000, "un million cinq cent mille francs CFA"],
    [2_000_000_000, "deux milliards de francs CFA"],
  ])("%d → %s", (amount, expected) => {
    expect(amountToWords(amount)).toBe(expected);
  });
});
