# Formatting

`ts-datetime` provides powerful and flexible formatting options to display dates and times in various formats.

## Basic Formatting

The primary method for formatting is the `.format()` method:

```ts
import { Datetime } from 'ts-datetime'

const date = new Datetime('2024-01-15T13:45:30Z')

// Basic formats
console.log(date.format('YYYY-MM-DD')) // "2024-01-15"
console.log(date.format('HH:mm:ss')) // "13:45:30"
console.log(date.format('MMM DD, YYYY')) // "Jan 15, 2024"
```

## Format Tokens

The following tokens are supported in format strings:

| Token | Description | Example |
|-------|-------------|---------|
| `YYYY` | 4-digit year | "2024" |
| `MM` | 2-digit month (01-12) | "01" |
| `DD` | 2-digit day (01-31) | "15" |
| `HH` | 2-digit hour (00-23) | "13" |
| `mm` | 2-digit minute (00-59) | "45" |
| `ss` | 2-digit second (00-59) | "30" |
| `SSS` | 3-digit millisecond (000-999) | "000" |

## Default Format

When using `.toString()` or calling `.format()` without arguments, `ts-datetime` uses a default format defined in your configuration:

```ts
const date = new Datetime('2024-01-15T13:45:30Z')

// Uses defaultFormat from config
console.log(date.toString()) // "2024-01-15T13:45:30Z"
```

You can customize the default format globally in your configuration or per instance:

```ts
// Global config (datetime.config.ts)
export default {
  defaultFormat: 'YYYY-MM-DD HH:mm'
}

// Per-instance config
const date = new Datetime('2024-01-15T13:45:30Z', {
  defaultFormat: 'DD/MM/YYYY'
})
console.log(date.toString()) // "15/01/2024"
```

## ISO and Standard Formats

For standard formats, `ts-datetime` provides dedicated methods:

```ts
const date = new Datetime('2024-01-15T13:45:30Z')

// ISO 8601 string
console.log(date.toISOString()) // "2024-01-15T13:45:30.000Z"
```
