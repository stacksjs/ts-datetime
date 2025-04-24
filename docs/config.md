# Configuration

The `ts-datetime` package is highly configurable and supports both global and per-instance configuration.

## Configuration File

You can create a `datetime.config.ts` (or `.js`) file in your project root to set global defaults:

```ts
// datetime.config.ts
import type { DatetimeConfig } from './src/types'

const config: DatetimeConfig = {
  /** Enable verbose logging for debugging */
  verbose: true,
  /** Default locale for formatting and humanization (e.g. 'en', 'fr') */
  locale: 'en',
  /** Default timezone (e.g. 'UTC', 'America/New_York') */
  timezone: 'UTC',
  /** Strict parsing of date strings */
  strict: false,
  /** First day of week (0=Sunday, 1=Monday, etc.) */
  firstDayOfWeek: 1,
  /** Default format string for .format()/.toString() */
  defaultFormat: 'YYYY-MM-DDTHH:mm:ssZ',
  /** Locale for parsing relative strings */
  parseLocale: 'en',
}

export default config
```

## Config Options

| Option           | Type      | Default                | Description                                                      |
|------------------|-----------|------------------------|------------------------------------------------------------------|
| `verbose`        | boolean   | `true`                 | Enable verbose logging for debugging                              |
| `locale`         | string    | `'en'`                 | Default locale for formatting and humanization                    |
| `timezone`       | string    | `'UTC'`                | Default timezone (future support)                                 |
| `strict`         | boolean   | `false`                | Strict parsing of date strings                                    |
| `firstDayOfWeek` | number    | `1`                    | First day of week (0=Sunday, 1=Monday, etc.)                     |
| `defaultFormat`  | string    | `'YYYY-MM-DDTHH:mm:ssZ'`| Default format string for `.format()` and `.toString()`           |
| `parseLocale`    | string    | `'en'`                 | Locale for parsing relative strings                               |

## Usage

You can override config globally (via the config file), per instance, or per method call:

```ts
import { Datetime } from 'ts-datetime'

// Uses global config
const d1 = new Datetime('2024-01-01T00:00:00Z')

// Override config per instance
const d2 = new Datetime('2024-01-01T00:00:00Z', { locale: 'fr', defaultFormat: 'DD/MM/YYYY' })

// Override config per method call
const d3 = Datetime.fromString('next week', { strict: true })
```

See the [Usage](./usage.md) page for more examples.
