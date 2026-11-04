# momo-kit

Phone numbers, mobile money operators and FCFA amounts for French-speaking Africa.

- Validate and normalize phone numbers (`677 12 34 56` → `+237677123456`)
- Detect the operator and its mobile money wallet (MTN Mobile Money, Orange Money…)
- Format FCFA amounts (`15 000 FCFA`)
- Write amounts in French words for invoices and receipts (`quinze mille francs CFA`)

Zero dependencies, fully typed, works in Node.js and in the browser.

## Install

```bash
npm install momo-kit
```

## Phone numbers

```ts
import { normalize, isValid, detectOperator, format, parse } from "momo-kit";

normalize("677 12 34 56", "CM");          // "+237677123456"
normalize("+221 77 123 45 67");           // "+221771234567"
normalize("1234", "CM");                  // null

isValid("07 12 34 56 78", "CI");          // true

detectOperator("+237 677 12 34 56");      // { country: "CM", operator: "MTN", wallet: "MTN Mobile Money" }
detectOperator("0512345678", "CI");       // { country: "CI", operator: "MTN", wallet: "MTN Mobile Money" }
detectOperator("90 12 34 56", "TG");      // { country: "TG", operator: "Togocom", wallet: "T-Money" }

format("+237677123456");                     // "6 77 12 34 56"
format("771234567", "SN", "international");  // "+221 77 123 45 67"

parse("+229 01 97 12 34 56");
// {
//   country: "BJ",
//   national: "0197123456",
//   international: "+2290197123456",
//   type: "mobile",
//   operator: "MTN",
//   wallet: "MTN Mobile Money"
// }
```

The country is detected from the dial code when the number starts with `+` or `00`. For a local number, pass the country code as the second argument.

Accepted inputs: spaces, dots, dashes, parentheses, `+`, `00` or a bare dial code.
Every function returns `null` when the number is not valid.

The operator is the one the prefix was originally assigned to. With number portability, a subscriber may have moved to another operator since.

## Amounts

```ts
import { formatAmount, toWords, amountToWords } from "momo-kit";

formatAmount(15000);                              // "15 000 FCFA"
formatAmount(15000, "XOF", { display: "code" });  // "15 000 XOF"

toWords(80);              // "quatre-vingts"
toWords(280000);          // "deux cent quatre-vingt mille"

amountToWords(15000);     // "quinze mille francs CFA"
amountToWords(1000000);   // "un million de francs CFA"
```

`formatAmount` uses the French typographic spaces: a narrow no-break space between thousands and a no-break space before the currency, so amounts never wrap across two lines.

`toWords` follows the French spelling rules: `vingt et un`, `soixante et onze`, `quatre-vingts` but `quatre-vingt-un`, `deux cents` but `deux cent mille`, `mille` always invariable.

## Supported countries

| Country | Code | Digits | Operators detected |
| --- | --- | --- | --- |
| Bénin | `BJ` | 10 | MTN, Moov, Celtiis |
| Burkina Faso | `BF` | 8 | Orange, Moov, Telecel |
| Cameroun | `CM` | 9 | MTN, Orange, Nexttel, Camtel |
| Congo | `CG` | 9 | MTN, Airtel |
| Côte d'Ivoire | `CI` | 10 | Orange, MTN, Moov |
| Mali | `ML` | 8 | Orange, Moov |
| Niger | `NE` | 8 | Niger Telecoms |
| Sénégal | `SN` | 9 | Orange, Yas, Expresso |
| Togo | `TG` | 8 | Togocom, Moov |

Numbers are validated for every country above. When a prefix is not in the data yet, the number stays valid and `operator` is `null`.

Gabon, Tchad, Centrafrique, Guinée équatoriale and Guinée-Bissau are coming next.

## Contributing

Operator prefixes change over time. If a number is detected with the wrong operator, open an issue with the prefix and a link to a source, or update the country file in `src/countries` and its tests in `test/phone.test.ts`.

```bash
npm install
npm test
npm run build
```

## License

MIT © Arolle Fona
