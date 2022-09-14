<div align="center">
  <img src="https://github.com/szkf/i18node.js/blob/master/assets/i18nodejs2.svg" width="80%" />
</div>

# i18node.js

Lightweight Internationalization Module for Node

### Note!

_Until version i18node.js v1.0.0 this module should not be considered production-ready!_

# Usage

### Use as Singleton

```js
const i18node = require('i18node.js') // import

// configure
i18node.config({ locales: ['de', 'en'], directory: __dirname + '/locales' })
```

Using singleton `i18node.js` will share the same configuration when imported in different files.

### Create an Instance

```js
const { I18Node } = require('i18node.js') // import

// create new instance with configuration
const i18node = new I18Node({ locales: ['en', 'pl'], directory: __dirname + '/locales' })

/* or */

// create new instance
const i18node = new I18Node()

// configure
i18node.config({ locales: ['en', 'de'], directory: __dirname + '/locales' })
```

## Configuration

### Config options

```js
i18node.config({
    // two locales: [source language locale, target language locale]
    // type: [string with BCP 47 language tag, string with BCP 47 language tag]
    // default: ["en", "en"]
    locales: ['en', 'de'],

    // where to store JSON locale files
    // type: string
    // default: /locales in the directory containing /node_modules
    directory: __dirname + '/locales',

    // translation fallbacks for missing tranlsations
    // type: { string: string, ...}
    // default: {}
    fallbacks: { de: 'nl' },

    // whether to warn about default "locales" and "directory" config options
    // type: boolean
    // default: true
    warnDefaults: true,

    // if set to true, warns of missing translations (or newly added translations)
    // type: boolean
    // default: false
    warnMissingTranslations: false,
})
```

## Translation

### Basic translation

`index.js`:

```js
const i18node = require('i18node.js')

i18node.config({ locales: ['en', 'de'], directory: __dirname + '/locales' })

i18node.t('How are you?') // "Wie geht es dir?"
```

`en.json`:

```json
{
    "How are you?": "How are you?"
}
```

`de.json`:

```json
{
    "How are you?": "Wie geht es dir?"
}
```

If a new phrase is translated, a blank tranlsation will be added to the target language JSON file.
The JSON locale files will be automatically created on new instance or config.

### Fallbacks

```js
i18node.config({ locales: ['en', 'cs'], directory: __dirname + '/locales', fallbacks: { cs: 'sk' } }) // configure fallbacks from Czech to Slovak

i18node.t('Hello! How are you?') // Ahoj! Ako sa máš? - falls back to Slovak as no tranlsation to Czech is found
```

`cs.json`:

```json
{
    "Hello! How are you?": ""
}
```

`sk.json`:

```json
{
    "Hello! How are you?": "Ahoj! Ako sa máš?"
}
```

There is no limit to the amount of fallbacks. There can be only one fallback for a specific language. Fallbacks don't stack (if language A falls back to B and B falls back to C, then if no translation is found for language A and B it will not fallback to C).

### Embed string value

Embed strings into the translation phrase using the `$()` syntax (notice the parenthesis instead of curly brackets).

```js
i18node.config({ locales: ['en', 'de'], directory: __dirname + '/locales' })

i18node.t('Hello, $(question)?', { question: 'how are you' }) // "Hallo, wie geht es dir?"
i18node.t('Hello, $(question)?', { question: "what's the weather like today" }) // "Hallo, wie ist das Wetter heute?"
```

`de.json`:

```json
{
    "Hello, $(question)?": "Hallo, $(question)?",
    "how are you": "wie geht es dir",
    "what's the weather like today": "wie ist das Wetter heute"
}
```

### Embed string value without translating

You can embed strings into the phrase without translating them using the `!()` syntax.

```js
i18node.config({ locales: ['en', 'de'], directory: __dirname + '/locales' })

i18node.t('Order number !(orderNumber)', { orderNumber: '1384207' }) // "Bestellen nummer 1384207"
i18node.t('Order number !(orderNumber)', { orderNumber: '1561841' }) // "Bestellen nummer 1561841"
```

`de.json`:

```json
{
    "Order number !(orderNumber)": "Bestellen nummer !(orderNumber)"
}
```

The `$()` and `!()` syntax can be used together in the same string. There are no limitations to the amount of embedded strings in the phrase.

### Plurals

Use the `#(pluralName)` syntax to add a plural to a phrase, then reference the name in the second paramater of the i18node.t() method:

```js
i18node.t(phrase, {
    pluralName: {
        value: 0, // number
        type: '', // 'cardinal' (default when the type is not provided) or 'ordinal'
    },
})
```

Pluralisation is provided by the [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules)

##### Cardinal numbers

```js
i18node.config({ locales: ['en', 'en'], directory: __dirname + '/locales' })

i18node.t('You have #(itemCount) item in your basket', { itemCount: { value: 1, type: 'cardinal' } }) // "You have 1 item in your basket"
i18node.t('You have #(itemCount) item in your basket', { itemCount: { value: 4, type: 'cardinal' } }) // "You have 4 items in your basket"
i18node.t('You have #(itemCount) item in your basket', { itemCount: { value: 0 } }) // "You have 0 items in your basket"
i18node.t('You have #(itemCount) item in your basket', { itemCount: { value: 15 } }) // "You have 15 items in your basket"
```

`en.json`:

```json
{
    "You have #(itemCount) item in your basket": {
        "full": "You have #(itemCount) in your basket",
        "itemCount": {
            "one": "You have #(itemCount) item in your basket",
            "other": "You have #(itemCount) items in your basket"
        }
    }
}
```

##### Ordinal numbers

```js
i18node.config({ locales: ['en', 'en'], directory: __dirname + '/locales' })

i18node.t('#(nthExample) example', { nthExample: { value: 1, type: 'ordinal' } }) // "1st example"
i18node.t('#(nthExample) example', { nthExample: { value: 2, type: 'ordinal' } }) // "2nd example"
i18node.t('#(nthExample) example', { nthExample: { value: 3, type: 'ordinal' } }) // "3rd example"
i18node.t('#(nthExample) example', { nthExample: { value: 4, type: 'ordinal' } }) // "4th example"
```

`en.json`:

```json
{
    "#(nthExample) example": {
        "full": "#(nthExample) example",
        "nthExample": {
            "few": "#(nthExample)rd",
            "one": "#(nthExample)st",
            "two": "#(nthExample)nd",
            "other": "#(nthExample)th"
        }
    }
}
```

##### Mulitple plurals in one phrase

```js
i18node.config({ locales: ['en', 'de'], directory: __dirname + '/locales' })

i18node.t('You have #(orangeCount) oranges and #(melonCount) melon', { orangeCount: 1, melonCount: 1 }) // Du hast 1 Orange und 1 Melone
i18node.t('You have #(orangeCount) oranges and #(melonCount) melon', { orangeCount: 1, melonCount: 2 }) // Du hast 1 Orange und 2 Melonen
i18node.t('You have #(orangeCount) oranges and #(melonCount) melon', { orangeCount: 2, melonCount: 1 }) // Du hast 1 Orangen und 2 Melon
i18node.t('You have #(orangeCount) oranges and #(melonCount) melon', { orangeCount: 2, melonCount: 2 }) // Du hast 2 Orangen und 2 Melonen
```

`de.json`:

```json
{
    "You have #(orangeCount) oranges and #(melonCount) melon": {
        "full": "Du hast #(orageCount) und #(melonCount)",
        "orangeCount": {
            "one": "#(orangeCount) Orange",
            "other": "#(orangeCount) Orangen"
        },
        "melonCount": {
            "one": "#(melonCount) Melon",
            "other": "#(melonCount) Melonen"
        }
    }
}
```

Cardinal and ordinal numbers can be used together in one phrase.
