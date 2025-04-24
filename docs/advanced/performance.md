# Performance

`ts-datetime` is designed with performance in mind, balancing functionality with efficient execution.

## Performance Characteristics

### Memory Usage

- **Immutable Design**: While immutability has many benefits, it does mean that each operation creates a new object. For highly performance-sensitive code that creates thousands of instances, consider object pooling or reuse patterns.

- **Lightweight Core**: The core `Datetime` class is a lightweight wrapper around the native JavaScript `Date`, keeping memory overhead minimal.

### Execution Speed

- **Native Date Under the Hood**: `ts-datetime` uses the native JavaScript `Date` object internally, which provides good performance for basic operations.

- **Caching**: Frequently accessed computed properties are cached when appropriate.

## Performance Tips

### Avoid Unnecessary Instantiation

```ts
// ❌ Less efficient - creates multiple temporary objects
const endOfMonth = new Datetime()
  .addMonths(1)
  .startOfMonth()
  .subDays(1)

// ✅ More efficient - minimal object creation
const now = new Datetime()
const endOfMonth = now.addMonths(1).startOfMonth().subDays(1)
```

### Reuse Date Objects When Possible

```ts
// ❌ Less efficient - creates many objects in a loop
for (let i = 0; i < 1000; i++) {
  const date = new Datetime(`2024-01-${i + 1}`)
  process(date)
}

// ✅ More efficient - reuses a single base object
const baseDate = new Datetime('2024-01-01')
for (let i = 0; i < 1000; i++) {
  process(baseDate.addDays(i))
}
```

### Use Periods for Iteration

For iterating over a date range, use the built-in `DatetimePeriod` which is optimized for iteration:

```ts
// ✅ Efficient iteration
const period = new DatetimePeriod(start, end, DatetimeInterval.days(1))
for (const date of period) {
  process(date)
}
```

### Consider Format Caching

If you're formatting the same date in the same format multiple times, cache the result:

```ts
// ❌ Potentially inefficient
function renderDate(date) {
  return `<span>${date.format('YYYY-MM-DD')}</span>`
}

// ✅ More efficient with caching
const formatCache = new Map()
function renderDate(date) {
  const key = `${date.toISOString()}-YYYY-MM-DD`
  if (!formatCache.has(key)) {
    formatCache.set(key, date.format('YYYY-MM-DD'))
  }
  return `<span>${formatCache.get(key)}</span>`
}
```

## Benchmarks

Performance characteristics of common operations (as measured on a reference system):

| Operation | Approximate Speed | Notes |
|-----------|------------------|-------|
| Construction | ~2-5μs | Depends on input type |
| Basic getters | <1μs | Year, month, day, etc. |
| Simple formatting | ~10-20μs | Format with a few tokens |
| Complex formatting | ~30-50μs | Format with many tokens |
| Diff calculation | ~5-10μs | Simple numerical difference |
| Human readable diff | ~20-30μs | Includes formatting |

_Note: These are approximate values and will vary based on hardware, JS engine, and context._
