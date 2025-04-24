# Immutable API

One of the core principles of `ts-datetime` is immutability. All operations that would modify a date instance return a new instance instead, which helps prevent side-effects and makes your code more predictable.

## Why Immutability Matters

Immutable objects have several advantages:

- Prevents accidental mutations
- Makes code easier to reason about
- Enables safe method chaining
- Better supports functional programming patterns

## Examples

```ts
import { Datetime } from 'ts-datetime'

const original = new Datetime('2024-01-01')
const modified = original.addDays(5)

console.log(original.format('YYYY-MM-DD')) // Still "2024-01-01"
console.log(modified.format('YYYY-MM-DD')) // "2024-01-06"
```

## Method Chaining

Since all methods return a new instance, you can chain them together for concise code:

```ts
const date = new Datetime('2024-01-01')
  .addMonths(2)
  .setHour(14)
  .setMinute(30)
  .startOfMinute()

console.log(date.format('YYYY-MM-DD HH:mm:ss')) // "2024-03-01 14:30:00"
```

## Cloning

If you need to create a copy of an existing datetime explicitly, you can use the `clone()` method:

```ts
const original = new Datetime('2024-01-01')
const copy = original.clone()

// Changes to copy won't affect original
```

## Implementation Details

All manipulation methods create a new `Datetime` instance under the hood, ensuring that the original remains untouched:

```ts
addDays(days: number): Datetime {
  const newDate = new Date(this._date)
  newDate.setDate(newDate.getDate() + days)
  return new Datetime(newDate, this._config)
}
```
