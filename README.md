# momo-kit

Mobile money operators and FCFA amounts for African apps.

`momo-kit` builds on [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js) for phone number validation and adds what it does not cover:

- **Which operator and which wallet** a number belongs to (MTN Mobile Money, Orange Money, Moov Money, T-Money, Flooz…), to preselect the right payment method
- **The payment provider code** for that number (`MTN_MOMO_CMR` for pawaPay…), to route the payment to the right API
- **FCFA amounts** formatted the French way (`15 000 FCFA`) and written in words for invoices and receipts (`quinze mille francs CFA`)
- **Real-world inputs**: old 8-digit Bénin numbers, dial codes typed without `+`

## Install

```bash
npm install momo-kit
```

## Operators and wallets

```ts
import { detectOperator, parse } from "momo-kit";

detectOperator("+237 677 12 34 56");
// { country: "CM", id: "mtn", operator: "MTN", wallet: "MTN Mobile Money", color: "#FFCC01" }

detectOperator("90 12 34 56", "TG");
// { country: "TG", id: "togocom", operator: "Togocom", wallet: "T-Money", color: null }

parse("+229 97 12 34 56");
// {
//   country: "BJ",
//   national: "0197123456",
//   international: "+2290197123456",
//   type: "mobile",
//   operatorId: "mtn",
//   operator: "MTN",
//   wallet: "MTN Mobile Money",
//   color: "#FFCC01"
// }
```

`id` is the same for an operator in every country (`orange` in Cameroun, Sénégal, Côte d'Ivoire…), so you can map it to your own logos. `color` is the operator's main brand color, or `null` when it is not in the data. Logos are not included: they are trademarks of each operator.

The wallet is only returned for mobile lines. The operator is the one the prefix was originally assigned to: with number portability, a subscriber may have moved to another operator since.

## Payment providers

```ts
import { getProviderCode } from "momo-kit";

getProviderCode("+237 677 12 34 56", "pawapay");      // "MTN_MOMO_CMR"
getProviderCode("+221 76 123 45 67", "pawapay");      // "FREE_SEN"
getProviderCode("97 12 34 56", "pawapay", "BJ");      // "MTN_MOMO_BEN"
getProviderCode("+228 90 12 34 56", "pawapay");       // null, not supported by pawaPay
```

| Provider | Countries |
| --- | --- |
| [pawaPay](https://docs.pawapay.io/v2/docs/providers) | Bénin, Burkina Faso, Cameroun, Congo, Côte d'Ivoire, Sénégal |

Wave works with any phone number, so it cannot be detected from the number: offer it as a separate choice.

## Phone numbers

```ts
import { normalize, isValid, format } from "momo-kit";

normalize("677 12 34 56", "CM");             // "+237677123456"
normalize("237 677 12 34 56");               // "+237677123456"
isValid("07 12 34 56 78", "CI");             // true
format("771234567", "SN", "international");  // "+221 77 123 45 67"
```

Validation and formatting come from libphonenumber-js, so they work for every country. The country is detected from the dial code; for a local number, pass the country code as the second argument. Every function returns `null` when the number is not valid.

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

## Operator data

| Country | Code | Operators |
| --- | --- | --- |
| Bénin | `BJ` | MTN, Moov, Celtiis |
| Burkina Faso | `BF` | Orange, Moov, Telecel |
| Cameroun | `CM` | MTN, Orange, Nexttel, Camtel |
| Congo | `CG` | MTN, Airtel |
| Côte d'Ivoire | `CI` | Orange, MTN, Moov |
| Mali | `ML` | Orange, Moov |
| Niger | `NE` | Niger Telecoms |
| Sénégal | `SN` | Orange, Yas, Expresso |
| Togo | `TG` | Togocom, Moov |

When a prefix is not in the data, the number stays valid and `operator` is `null`. Every prefix is checked against libphonenumber-js in the test suite.

## Contributing

Operator prefixes change over time. If a number is detected with the wrong operator, open an issue with the prefix and a link to a source, or update the country file in `src/countries` and add a case in `test/phone.test.ts`.

```bash
npm install
npm test
npm run build
```

## License

MIT © Arolle Fona
