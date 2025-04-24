# Human Diffs

`ts-datetime` provides human-readable time differences through the `diffForHumans()` method, making it easy to display time differences in a natural, readable way.

## Basic Usage

```ts
import { Datetime } from 'ts-datetime'

const now = Datetime.now()
const pastDate = now.subDays(2)
const futureDate = now.addHours(5)

console.log(pastDate.diffForHumans()) // "2 days ago"
console.log(futureDate.diffForHumans()) // "in 5 hours"
```

## Comparison Reference

By default, `diffForHumans()` compares the date to the current time. You can provide a reference date to compare against instead:

```ts
const date1 = new Datetime('2024-01-01T00:00:00Z')
const date2 = new Datetime('2024-01-05T12:00:00Z')

// Compare date1 to date2
console.log(date1.diffForHumans(date2)) // "4 days 12 hours ago"

// Compare date2 to date1
console.log(date2.diffForHumans(date1)) // "in 4 days 12 hours"
```

## Localization

Human diffs are automatically localized based on the locale setting:

```ts
const date = new Datetime('2024-01-01').subDays(1)

// Default locale (English)
console.log(date.diffForHumans()) // "1 day ago"

// With French locale
const frenchDate = new Datetime('2024-01-01', { locale: 'fr' }).subDays(1)
console.log(frenchDate.diffForHumans()) // "il y a 1 jour"
```

## Relative Time Units

The `diffForHumans()` method automatically selects the most appropriate time unit to express the difference:

```ts
const now = Datetime.now()

console.log(now.subSeconds(10).diffForHumans()) // "10 seconds ago"
console.log(now.subMinutes(5).diffForHumans()) // "5 minutes ago"
console.log(now.subHours(2).diffForHumans()) // "2 hours ago"
console.log(now.subDays(3).diffForHumans()) // "3 days ago"
console.log(now.subMonths(1).diffForHumans()) // "1 month ago"
console.log(now.subYears(2).diffForHumans()) // "2 years ago"
```

## Just Now Threshold

Very recent times use "just now" instead of "0 seconds ago":

```ts
const justNow = Datetime.now().subSeconds(2)
console.log(justNow.diffForHumans()) // "just now"
```

## Implementation Details

Human diffs combine the functionality of `diff()` with localized formatting:

```ts
// Inside diffForHumans() implementation:
const ms = this.diff(reference, 'ms')
const absDiff = Math.abs(ms)

if (absDiff < 5000) {
  return locale.justNow
}
if (absDiff < 60000) {
  const seconds = Math.floor(absDiff / 1000)
  return ms < 0
    ? locale.ago(seconds, locale.units.second)
    : locale.in(seconds, locale.units.second)
}
// ... more time units
```
