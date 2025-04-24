# Intervals

Intervals in `ts-datetime` represent a duration of time. The `DatetimeInterval` class provides a way to work with time spans independent of specific dates.

## Creating Intervals

`DatetimeInterval` can be created in several ways:

```ts
import { DatetimeInterval } from 'ts-datetime'

// Using static factory methods
const twoHours = DatetimeInterval.hours(2)
const fiveDays = DatetimeInterval.days(5)
const threeMonths = DatetimeInterval.months(3)

// Using constructor
const complex = new DatetimeInterval({
  years: 1,
  months: 2,
  days: 3,
  hours: 4,
  minutes: 5,
  seconds: 6,
  milliseconds: 7
})
```

## Interval Operations

Intervals can be manipulated with various methods:

```ts
import { DatetimeInterval } from 'ts-datetime'

// Creating intervals
const days = DatetimeInterval.days(2)
const hours = DatetimeInterval.hours(3)

// Adding intervals
const combined = days.add(hours)
console.log(combined.forHumans()) // "2 days 3 hours"

// Converting to milliseconds
const ms = combined.toMilliseconds()
console.log(ms) // ~172800000 + 10800000 milliseconds
```

## Human-readable Representation

Intervals can be converted to human-readable strings:

```ts
const interval = new DatetimeInterval({
  days: 2,
  hours: 5,
  minutes: 30
})

console.log(interval.forHumans()) // "2 days 5 hours 30 minutes"
```

## Using Intervals with Datetimes

Intervals can be used to calculate new dates or measure time between dates:

```ts
import { Datetime, DatetimeInterval } from 'ts-datetime'

const start = new Datetime('2024-01-01')

// Add an interval to a date
const interval = DatetimeInterval.days(5).add(DatetimeInterval.hours(12))
const end = start.add(interval)

console.log(end.format('YYYY-MM-DD HH:mm')) // "2024-01-06 12:00"

// Get interval between two dates
const diff = start.intervalUntil(end)
console.log(diff.forHumans()) // "5 days 12 hours"
```

## Negative Intervals

Intervals can represent negative durations:

```ts
const negInterval = DatetimeInterval.days(-3)
console.log(negInterval.forHumans()) // "-3 days"

// Using negative intervals in calculations
const date = new Datetime('2024-01-15')
const earlier = date.add(negInterval)
console.log(earlier.format('YYYY-MM-DD')) // "2024-01-12"
```
