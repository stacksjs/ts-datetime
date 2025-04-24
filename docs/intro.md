# ts-datetime

A modern, immutable, and fully-typed TypeScript datetime library inspired by Carbon (PHP) and Day.js.

## Why ts-datetime?

- **Immutable**: All operations return new instances.
- **Fluent API**: Chainable, readable, and expressive.
- **Locale & Config**: Global, per-instance, and per-call configuration for locale, formatting, and more.
- **Robust Parsing**: Supports ISO, timestamps, relative strings (e.g. "next week", "+2 days"), and strict mode.
- **Intervals & Periods**: Built-in support for durations and date ranges.
- **TypeScript First**: Fully typed, with great DX in modern editors.
- **Tested**: Thoroughly tested for edge cases and correctness.

## Get Started

Install with your favorite package manager:

```sh
bun add ts-datetime
# or
npm install ts-datetime
```

See the [Install](./install.md) and [Usage](./usage.md) pages for more details.

## Example

```ts
import { Datetime } from 'ts-datetime'

const d = new Datetime('2024-01-01T00:00:00Z')
console.log(d.addDays(5).format('YYYY-MM-DD')) // "2024-01-06"
console.log(d.diffForHumans()) // "just now"
```

## Features

- Immutable, chainable API
- Customizable config (locale, format, strict, etc.)
- Human-readable diffs and intervals
- Relative string parsing ("next week", "+2 days", etc.)
- Period/interval iteration
- Full TypeScript support

See the [Config](./config.md) and [Usage](./usage.md) pages for more!
