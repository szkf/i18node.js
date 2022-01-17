<div align="center">
  <img src="https://github.com/szkf/i18node.js/blob/master/assets/i18nodejs.svg" width="75%" />
</div>

# i18node.js

Lightweight Internationalization Module for Node

### Note!

This module should not be considered production-ready yet!

## Usage

### Use as Singleton

```js
const i18node = reauire('i18node.js')

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

### Configuration

#### Config options

```js
i18node.config({
    // two locales
    // default: ["en", "en"]
    locales: ['en', 'en'],

    // where to store JSON locale files
    // default: /locales in the directory containing /node_modules
    directory: __dirname + '/locales',

    // if set to false, doesn't warn of default 'locales' and 'directory' config options
    // default: true
    warnDefaults: true,

    // if set to true, warns of missing translations
    // default: false
    warnMissingTranslations: false,
})
```

### Basic Translation

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

The JSON locale files will (if not exist already) be automaticly created on new instance or config.<br />
