const assert = require("node:assert");
const { detectOperator, normalize, amountToWords } = require("../dist/index.cjs");

assert.deepStrictEqual(detectOperator("+237677123456"), { country: "CM", operator: "MTN", wallet: "MTN Mobile Money" });
assert.strictEqual(normalize("+229 97 12 34 56"), "+2290197123456");
assert.strictEqual(amountToWords(1000000), "un million de francs CFA");
console.log(`CommonJS OK on Node ${process.version}`);
