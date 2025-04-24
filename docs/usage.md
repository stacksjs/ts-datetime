# Usage

Here are some common usage patterns for `ts-datetime`.

## Construction

```ts
import { Datetime } from 'ts-datetime'

const d1 = new Datetime() // now
const d2 = new Datetime('2024-01-01T00:00:00Z')
const d3 = new Datetime(1704067200000) // timestamp
const d4 = new Datetime(new Date())
```

## Static Constructors

```ts
Datetime.now()
Datetime.today()
Datetime.tomorrow()
Datetime.yesterday()
Datetime.fromString('2024-01-01T00:00:00Z')
Datetime.fromTimestamp(1704067200000)
```

## Manipulation

```ts
const d = new Datetime('2024-01-01T00:00:00Z')
d.addDays(5)
d.subMonths(1)
d.addYears(2)
d.addHours(3).addMinutes(15)
```

## Formatting

```ts
const d = new Datetime('2024-01-01T12:34:56Z')
d.format('YYYY-MM-DD HH:mm') // '2024-01-01 12:34'
d.toString() // uses defaultFormat from config
d.toISOString() // ISO string
```

## Human-Readable Diffs

```ts
d.diffForHumans() // 'just now', '2 days ago', 'in 3 hours', etc.
```

## Intervals and Periods

```ts
import { DatetimeInterval, DatetimePeriod } from 'ts-datetime'

const interval = DatetimeInterval.days(3).add(DatetimeInterval.hours(5))
interval.forHumans() // '3 days 5 hours'

const start = new Datetime('2024-01-01')
const end = new Datetime('2024-01-05')
const period = new DatetimePeriod(start, end, DatetimeInterval.days(2))
for (const d of period) {
  console.log(d.format('YYYY-MM-DD')) // 2024-01-01, 2024-01-03, 2024-01-05
}
```

## Relative String Parsing

```ts
Datetime.fromString('next week')
Datetime.fromString('+2 days')
Datetime.fromString('last month')
```

## Config Overrides

```ts
const d = new Datetime('2024-01-01T00:00:00Z', { locale: 'fr', defaultFormat: 'DD/MM/YYYY' })
console.log(d.toString()) // '01/01/2024'
```

See the [Config](./config.md) page for more on configuration.
