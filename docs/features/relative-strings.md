# Relative Strings

`ts-datetime` supports parsing relative date-time strings, allowing you to create dates using natural language expressions that describe dates relative to the current time.

## Basic Usage

```ts
import { Datetime } from 'ts-datetime'

// Parse relative strings
const tomorrow = Datetime.fromString('tomorrow')
const lastWeek = Datetime.fromString('last week')
const nextMonth = Datetime.fromString('next month')
```

## Supported Formats

`ts-datetime` supports several types of relative expressions:

### Simple Relative Keywords

```ts
Datetime.fromString('now')
Datetime.fromString('today')
Datetime.fromString('tomorrow')
Datetime.fromString('yesterday')
```

### Unit-based Expressions

```ts
// Addition with + prefix
Datetime.fromString('+2 days')
Datetime.fromString('+1 week')
Datetime.fromString('+3 months')
Datetime.fromString('+1 year')

// Subtraction with - prefix
Datetime.fromString('-3 hours')
Datetime.fromString('-2 weeks')
```

### Directional Expressions

```ts
Datetime.fromString('next day')
Datetime.fromString('next week')
Datetime.fromString('next month')
Datetime.fromString('next year')

Datetime.fromString('last minute')
Datetime.fromString('last hour')
Datetime.fromString('last day')
```

### Combined Expressions

```ts
Datetime.fromString('next week +2 days')
Datetime.fromString('tomorrow at noon')
Datetime.fromString('yesterday -3 hours')
```

## Strict Parsing

By default, relative string parsing is forgiving. If you want to ensure that strings are valid, use the `strict` option:

```ts
// Will throw if the string format is invalid
const date = Datetime.fromString('nexr week', { strict: true })
```

## Localization

Relative string parsing supports different locales through the `parseLocale` option:

```ts
// Parse French relative expressions
const frenchDate = Datetime.fromString('demain', { parseLocale: 'fr' })
```

## Caveats

- Relative string parsing is approximate and may not account for all calendar edge cases
- For exact date calculations, use the explicit date manipulation methods instead
- The current implementation focuses on English language expressions by default

```
