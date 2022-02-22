<div align="center">
  <img src="https://github.com/szkf/i18node.js/blob/master/assets/i18nodejs.svg" width="50%" />
</div>

# i18node.js

Lightweight Internationalization Module for Node

### Note!

Until version v1.0.0 this module should not be considered production-ready!

# Usage

### Use as Singleton

```js
const i18node = require('i18node.js')

// configure
i18node.config({ locales: ['de', 'en'], directory: __dirname + '/locales' })
```

By using singleton you can import `i18node.js` in different files and it will share the same configuration.

### Create an Instance

```js
const { I18Node } = require('i18node.js')

// create new instance with configuration
const i18node = new I18Node({ locales: ['en', 'pl'], directory: __dirname + '/locales' })
```

You can also configure after creating an instance:

```js
const { I18Node } = require('i18node.js')

// create new instance
const i18node = new I18Node()

// configure
i18node.config({ locales: ['en', 'de'], directory: __dirname + '/locales' })
```

## Configuration

### Config options

```js
i18node.config({
    // two locales
    // default: ["en", "en"]
    locales: ['en', 'de'],

    // where to store JSON locale files
    // default: /locales in the directory containing /node_modules
    directory: __dirname + '/locales',

    // translation fallbacks for missing tranlsations
    // default: {}
    fallbacks: { de: 'nl' },

    // whether to warn about default "locales" and "directory" config options
    // default: true
    warnDefaults: true,

    // if set to true, warns of missing translations
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

console.log(i18node.t('How are you?')) // "Wie geht es dir?"
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
The JSON locale files will (if not exist already) be automaticly created on new instance or config.

### Fallbacks

```js
i18node.config({ locales: ['en', 'cs'], directory: __dirname + '/locales', fallbacks: { cs: 'sk' } }) // configure fallbacks from Czech to Slovak

console.log(i18node.t('Hello! How are you?')) // Ahoj! Ako sa máš? - falls back to Slovak as no tranlsation to Czech is found
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

There is no limit to the amount of fallbacks. There can be only one fallback for a specific language. Fallbacks don't stack (if language A falls back to B and B to C, then if no translation is found for language A and B it will not fallback to C).

### Template string translation

Embed strings into the translation phrase using the `$()` syntax (notice the parenthesis instead of curly brackets).

```js
i18node.config({ locales: ['en', 'de'], directory: __dirname + '/locales' })

console.log(i18node.t('Hello, $(question)?', { question: 'how are you' })) // "Hallo, wie geht es dir?"
console.log(i18node.t('Hello, $(question)?', { question: "what's the weather like today" })) // "Hallo, wie ist das Wetter heute?"
```

`de.json`:

```json
{
    "Hello, $(question)?": "Hallo, $(question)?",
    "how are you": "wie geht es dir",
    "what's the weather like today": "wie ist das Wetter heute"
}
```

### Template string without translating

You can embed strings into the phrase without translating them using the `!()` syntax.

```js
i18node.config({ locales: ['en', 'de'], directory: __dirname + '/locales' })

console.log(i18node.t('Order number !(orderNumber)', { orderNumber: '1384207' })) // "Bestellen nummer 1384207"
console.log(i18node.t('Order number !(orderNumber)', { orderNumber: '1561841' })) // "Bestellen nummer 1561841"
```

`de.json`:

```json
{
    "Order number !(orderNumber)": "Bestellen nummer !(orderNumber)"
}
```

The `$()` and `!()` syntax can be used together in the same string. There are no limitations to the amount of embedded strings in the phrase.

### Plurals

There can only be one plural in the phrase. Support for multiple coming soon.
Pluralisation is provided by the [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules)

```js
i18node.config({ locales: ['en', 'en'], directory: __dirname + '/locales' })

console.log(i18node.t('You have #(itemsCount) item in your basket', { itemCount: 1 })) // "You have 1 item in your basket"
console.log(i18node.t('You have #(itemsCount) item in your basket', { itemCount: 4 })) // "You have 4 items in your basket"
console.log(i18node.t('You have #(itemsCount) item in your basket', { itemCount: 0 })) // "You have 0 items in your basket"
console.log(i18node.t('You have #(itemsCount) item in your basket', { itemCount: 15 })) // "You have 15 items in your basket"
```

`en.json`:

```json
{
    "You have #(itemsCount) item in your basket": {
        "one": "You have #(itemsCount) item in your basket",
        "other": "You have #(itemsCount) items in your basket"
    }
}
```
