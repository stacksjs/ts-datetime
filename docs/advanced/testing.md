# Testing

`ts-datetime` is rigorously tested to ensure reliability and correctness. This page outlines the testing approach and provides guidance for testing your own code that uses the library.

## Library Test Coverage

The `ts-datetime` library itself is tested using a comprehensive test suite that covers:

- Core functionality
- Edge cases
- Localization
- Configuration variants
- Performance benchmarks

All public API methods are tested with a variety of inputs and expected outputs.

## Testing Your Code

### Mocking Current Time

When testing code that uses `ts-datetime`, you might need to mock the current time. Here's how:

```ts
import { Datetime } from 'ts-datetime'

// Save the original now method
const originalNow = Date.now

// Mock current time to a specific timestamp
Date.now = jest.fn(() => new Date('2024-01-01T12:00:00Z').getTime())

// Your test code
test('feature works with fixed time', () => {
  const now = Datetime.now()
  expect(now.year).toBe(2024)
  expect(now.month).toBe(1)
  expect(now.day).toBe(1)
})

// Restore original after tests
afterAll(() => {
  Date.now = originalNow
})
```

### Test Helpers

You can create test helpers to simplify datetime testing:

```ts
// dateHelpers.ts
export function createFixedDatetime(dateString: string) {
  return new Datetime(dateString)
}

export function expectDateEqual(date: Datetime, year: number, month: number, day: number) {
  expect(date.year).toBe(year)
  expect(date.month).toBe(month)
  expect(date.day).toBe(day)
}
```

### Testing Format Output

When testing formatted outputs, be explicit about the format to avoid test fragility:

```ts
test('formatting works correctly', () => {
  const date = new Datetime('2024-01-15T14:30:45Z')

  // ✅ Good - explicitly specify format
  expect(date.format('YYYY-MM-DD')).toBe('2024-01-15')

  // ❌ Fragile - depends on default format which could change
  expect(date.toString()).toBe('2024-01-15T14:30:45Z')
})
```

### Testing Date Comparisons

When testing date comparisons, ensure proper timezone handling:

```ts
test('date comparisons work correctly', () => {
  const date1 = new Datetime('2024-01-01T00:00:00Z')
  const date2 = new Datetime('2024-01-02T00:00:00Z')

  expect(date1.isBefore(date2)).toBe(true)
  expect(date2.isAfter(date1)).toBe(true)
  expect(date1.isSame(date1.clone())).toBe(true)
})
```

## Test Strategies

### Unit Testing

For unit testing components that use `ts-datetime`:

```ts
test('DateDisplay component shows formatted date', () => {
  const fixedDate = new Datetime('2024-01-15')
  const component = render(<DateDisplay date={fixedDate} />)
  expect(component.getByText('January 15, 2024')).toBeInTheDocument()
})
```

### Integration Testing

For integration testing with time-dependent features:

```ts
test('Scheduled notifications are sent at the right time', async () => {
  // Mock time
  jest.useFakeTimers()
  Date.now = jest.fn(() => new Date('2024-01-01T11:59:50Z').getTime())

  // Set up a notification for noon
  const scheduler = new Scheduler()
  scheduler.scheduleFor(Datetime.fromString('12:00'))

  // Fast-forward time
  jest.advanceTimersByTime(15 * 1000) // 15 seconds

  // Check notification was sent
  expect(notificationSpy).toHaveBeenCalled()
})
```

## Common Test Pitfalls

- **Timezone differences**: Be explicit about timezones in tests to avoid inconsistencies
- **DST transitions**: Be aware of daylight saving time transitions in tests that span these periods
- **Date equality**: Use `isSame()` rather than object equality checks
- **Format dependencies**: Don't rely on default formatting in tests
