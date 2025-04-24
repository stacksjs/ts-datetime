# Type Safety

`ts-datetime` is built from the ground up with TypeScript, providing strong type-safety throughout the library.

## Typed Methods and Parameters

All methods in `ts-datetime` are fully typed:

```ts
import { Datetime } from 'ts-datetime'

// TypeScript will enforce correct parameter types
const d = new Datetime('2024-01-01')

// ✅ Correct
d.add({ days: 5 })
d.diff(new Date(), 'day')
d.format('YYYY-MM-DD')

// ❌ TypeScript errors
d.add('5 days') // Error: argument type is incorrect
d.diff(123, 'incorrect') // Error: invalid unit
```

## Type Definitions

The library provides comprehensive type definitions:

```ts
// DatetimeInput - Union type for all valid constructor inputs
export type DatetimeInput = string | number | Date | Datetime

// DatetimeConfig - Interface for configuration options
export interface DatetimeConfig {
  verbose: boolean
  locale: string
  timezone?: string
  strict?: boolean
  firstDayOfWeek?: number
  defaultFormat?: string
  parseLocale?: string
}

// Units for diff methods
type DatetimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'ms'
```

## Intellisense Support

The TypeScript definitions enable rich Intellisense in supported editors:

- Method autocompletion
- Parameter hints
- Documentation comments
- Type checking

## Discriminated Unions and Strict Typing

The library uses advanced TypeScript features for better safety:

```ts
// Return types are precisely defined
method(): Datetime // Returns a new Datetime instance
method(): string // Returns a string
method(): number // Returns a number

// Parameter types are precise
method(input: DatetimeInput) // Accepts any valid datetime input
method(unit: 'year' | 'month' | 'day') // Only accepts specific string literals
```

## Generic Type Parameters

For collection methods, the library uses generics where appropriate:

```ts
// Example of period iteration with Array.from
const period = new DatetimePeriod(start, end, interval)
const dates: Datetime[] = Array.from(period)

// Map with type inference
const formatted: string[] = dates.map(date => date.format('YYYY-MM-DD'))
```

## Benefits of Type Safety

Using the library with TypeScript provides several advantages:

- Catch errors at compile-time rather than runtime
- Better editor support with autocomplete
- Self-documenting code
- Refactoring safety
- Improved maintainability
