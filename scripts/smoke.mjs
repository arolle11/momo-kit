import assert from "node:assert";
import { detectOperator, formatAmount } from "../dist/index.js";

assert.deepStrictEqual(detectOperator("0512345678", "CI"), { country: "CI", operator: "MTN", wallet: "MTN Mobile Money" });
assert.strictEqual(formatAmount(15000), "15 000 FCFA");
console.log(`ESM OK on Node ${process.version}`);
