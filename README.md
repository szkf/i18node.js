<div align="center">
  <img src="https://github.com/szkf/i18node.js/blob/master/assets/i18nodejs.svg" width="75%" />
</div>

# i18node.js

Lightweight Internationalization Module for Node

### Note!

This module should not be considered production-ready yet!

## Usage

## Import As Singleton (default)

```js
const i18node = reauire('i18node.js')

// configure
i18node.config({ locales: ['de', 'en'], directory: __dirname + '/locales' })
```

By using singleton you can require `i18node.js` in different files and it will use the same configuration.

### Import As Instance

```js
const { I18Node } = require('i18node.js')

// create new instance with configuration
const i18node = new I18Node({ locales: ['en', 'pl'], directory: __dirname + '/locales' })
```

Alternatively you can configure after creating a instance:

```js
const { I18Node } = require('i18node.js')

// create new instance
const i18node = new I18Node()

// configure
i18node.config({ locales: ['en', 'de'], directory: __dirname + '/locales' })
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
