# Localization

`ts-datetime` includes support for localization, allowing you to display dates and time differences in different languages.

## Setting Locales

Locales can be configured at different levels:

```ts
import { Datetime } from 'ts-datetime'

// Global default (in config)
// datetime.config.ts
export default {
  locale: 'en',
}

// Per-instance
const frenchDate = new Datetime('2024-01-01', { locale: 'fr' })

// Per-call
const spanishDiff = date.diffForHumans({ locale: 'es' })
```

## Supported Features

Localization affects several features:

1. Human-readable time differences (`diffForHumans()`)
2. Month and day names in formatted dates
3. Relative date string parsing

## Available Locales

Currently, the following locales are supported:

- `en` - English (default)
- `fr` - French
- `es` - Spanish
- `de` - German
- (Add more as they become available)

## Custom Locales

You can add custom locales by extending the locales object:

```ts
import { addLocale } from 'ts-datetime'

addLocale('it', {
  justNow: 'proprio ora',
  ago: (n, unit) => `${n} ${unit}${n !== 1 ? 'i' : 'o'} fa`,
  in: (n, unit) => `tra ${n} ${unit}${n !== 1 ? 'i' : 'o'}`,
  units: {
    year: 'ann',
    month: 'mes',
    day: 'giorn',
    hour: 'or',
    minute: 'minut',
    second: 'second',
    ms: 'ms',
  },
  interval: parts => parts.length ? parts.join(' ') : '0 secondi',
})
```

## Implementation Details

Locale definitions follow this structure:

```ts
interface Locale {
  justNow: string
  ago: (n: number, unit: string) => string
  in: (n: number, unit: string) => string
  units: {
    year: string
    month: string
    day: string
    hour: string
    minute: string
    second: string
    ms: string
  }
  interval: (parts: string[]) => string
}
```

Each locale provides functions for formatting time differences and a mapping of unit names.
