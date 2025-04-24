# Periods

The `DatetimePeriod` class in `ts-datetime` represents a range of time between two datetimes, along with a step interval. This provides an elegant way to iterate over a series of datetimes.

## Creating Periods

You can create a period using the constructor or the `periodUntil` method on a `Datetime` instance:

```ts
import { Datetime, DatetimeInterval, DatetimePeriod } from 'ts-datetime'

// Using constructor
const start = new Datetime('2024-01-01')
const end = new Datetime('2024-01-10')
const period = new DatetimePeriod(start, end, DatetimeInterval.days(2))

// Using periodUntil method
const period2 = start.periodUntil(end, DatetimeInterval.days(2))
```

## Iterating Periods

The most powerful feature of periods is iteration. A `DatetimePeriod` implements the JavaScript iterable protocol, allowing it to be used in `for...of` loops:

```ts
const start = new Datetime('2024-01-01')
const end = new Datetime('2024-01-10')
const period = new DatetimePeriod(start, end, DatetimeInterval.days(2))

// Iterate over each date in the period
for (const date of period) {
  console.log(date.format('YYYY-MM-DD'))
}
// Output:
// 2024-01-01
// 2024-01-03
// 2024-01-05
// 2024-01-07
// 2024-01-09
```

## Using with Array Methods

Since periods are iterable, you can convert them to arrays and use all standard array methods:

```ts
const period = new DatetimePeriod(
  new Datetime('2024-01-01'),
  new Datetime('2024-01-10'),
  DatetimeInterval.days(1)
)

// Convert to array
const dates = Array.from(period)

// Filter, map, etc.
const weekends = dates.filter(date => date.dayOfWeek === 0 || date.dayOfWeek === 6)
const formatted = dates.map(date => date.format('DD/MM'))
```

## Custom Intervals

You can use any interval as the step for a period:

```ts
// Every 12 hours
const hourlyPeriod = new DatetimePeriod(
  new Datetime('2024-01-01'),
  new Datetime('2024-01-03'),
  DatetimeInterval.hours(12)
)

// Every other month
const monthlyPeriod = new DatetimePeriod(
  new Datetime('2024-01-01'),
  new Datetime('2024-12-31'),
  DatetimeInterval.months(2)
)
```

## Edge Cases

The period implementation handles some edge cases gracefully:

```ts
// If start is after end, it will yield only the start date
const reversePeriod = new DatetimePeriod(
  new Datetime('2024-01-10'),
  new Datetime('2024-01-01'),
  DatetimeInterval.days(1)
)
// Iterating will yield only 2024-01-10

// If interval doesn't evenly divide the range, it stops at or before the end
const unevenPeriod = new DatetimePeriod(
  new Datetime('2024-01-01'),
  new Datetime('2024-01-05'),
  DatetimeInterval.days(2)
)
// Yields: 2024-01-01, 2024-01-03, 2024-01-05
```
