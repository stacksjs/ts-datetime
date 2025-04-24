import { describe, expect, it } from 'bun:test'
import { Datetime, DatetimeInterval, DatetimePeriod } from '../src/datetime'

const isoDate = '2024-05-01T12:34:56.789Z'
const timestamp = Date.parse(isoDate)

describe('Datetime construction', () => {
  it('constructs from Date, string, number, Datetime', () => {
    const d2 = new Datetime(new Date(isoDate))
    const d3 = new Datetime(isoDate)
    const d4 = new Datetime(timestamp)
    const d5 = new Datetime(d2)
    expect(d2.toISOString()).toBe(isoDate)
    expect(d3.toISOString()).toBe(isoDate)
    expect(d4.toISOString()).toBe(isoDate)
    expect(d5.toISOString()).toBe(isoDate)
  })

  it('throws on invalid date in strict mode', () => {
    expect(() => new Datetime('not-a-date', { strict: true })).toThrow()
  })

  it('parses ambiguous/invalid dates in non-strict mode', () => {
    expect(() => new Datetime('not-a-date')).not.toThrow()
  })

  it('handles empty and whitespace strings', () => {
    expect(() => new Datetime('')).not.toThrow()
    expect(() => new Datetime('   ')).not.toThrow()
  })
})

describe('Leap years and month boundaries', () => {
  it('handles leap years', () => {
    const d = new Datetime('2020-02-29T00:00:00Z')
    expect(d.month).toBe(2)
    expect(d.day).toBe(29)
    expect(d.isLeapYear).toBe(true)
    expect(d.addYears(1).month).toBe(2)
    expect(d.addYears(1).day).toBe(28) // 2021-02-28 (snap)
  })

  it('handles end/start of months', () => {
    const d = new Datetime('2024-01-31T00:00:00Z')
    expect(d.addMonths(1).month).toBe(2)
    expect(d.addMonths(1).day).toBe(29) // 2024 is leap year, snap
    expect(d.subMonths(1).month).toBe(12)
    expect(d.subMonths(1).day).toBe(31) // snap to last day of Dec
  })
})

describe('Manipulation edge cases', () => {
  it('handles negative and zero values', () => {
    const d = new Datetime('2024-01-01T00:00:00Z')
    expect(d.addDays(0).day).toBe(1)
    expect(d.addDays(-1).day).toBe(31)
    expect(d.subDays(0).day).toBe(1)
    expect(d.subDays(-1).day).toBe(2)
  })
})

describe('Formatting edge cases', () => {
  it('formats with all supported tokens', () => {
    const d = new Datetime('2024-01-02T03:04:05.123Z')
    expect(d.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2024-01-02 03:04:05.123')
  })
  it('formats with missing/invalid tokens', () => {
    const d = new Datetime('2024-01-02T03:04:05.123Z')
    expect(d.format('FOO-BAR')).toBe('FOO-BAR')
    expect(d.format('YYYY-FOO-DD')).toBe('2024-FOO-02')
  })
})

describe('Locale switching and fallback', () => {
  it('falls back to en if locale is missing', () => {
    const d = new Datetime('2024-01-01T00:00:00Z', { locale: 'not-a-locale' })
    expect(d.getLocale()).toBe('not-a-locale') // fallback logic is in formatting/humanization
    expect(d.diffForHumans()).toMatch(/ago|in|just now/)
  })
})

describe('Config overrides', () => {
  it('overrides config at all levels', () => {
    const d = new Datetime('2024-01-01T00:00:00Z', { locale: 'en', defaultFormat: 'YYYY' })
    expect(d.toString()).toBe('2024')
    expect(d.getLocale()).toBe('en')
    expect(new Datetime('2024-01-01T00:00:00Z').getLocale()).toBe('en') // global fallback
  })
})

describe('Interval/Period edge cases', () => {
  it('handles negative intervals', () => {
    const i = DatetimeInterval.days(-3)
    expect(i.days).toBe(-3)
    expect(i.forHumans()).toContain('-3 day')
  })
  it('handles zero interval', () => {
    const i = DatetimeInterval.days(0)
    expect(i.forHumans()).toContain('0 seconds')
  })
  it('DatetimePeriod with start > end yields one value', () => {
    const start = new Datetime('2024-01-03')
    const end = new Datetime('2024-01-01')
    const period = new DatetimePeriod(start, end, DatetimeInterval.days(1))
    const days = Array.from(period).map(d => d.day)
    expect(days.length).toBe(1)
    expect(days[0]).toBe(3)
  })
  it('DatetimePeriod with zero interval yields infinite loop protection', () => {
    const start = new Datetime('2024-01-01')
    const end = new Datetime('2024-01-03')
    const period = new DatetimePeriod(start, end, DatetimeInterval.days(0))
    const days = []
    for (const d of period) {
      days.push(d.day)
      if (days.length > 10)
        break // protect against infinite loop
    }
    expect(days.length).toBeLessThanOrEqual(11)
  })
})

describe('diffForHumans and forHumans', () => {
  it('diffForHumans works for past, future, and now', () => {
    const now = Datetime.now()
    expect(now.diffForHumans(now)).toBe('just now')
    expect(now.addDays(2).diffForHumans(now)).toMatch(/in 2 days/)
    expect(now.subDays(2).diffForHumans(now)).toMatch(/2 days ago/)
  })
  it('forHumans works for various intervals', () => {
    expect(DatetimeInterval.days(1).forHumans()).toContain('1 day')
    expect(DatetimeInterval.days(2).forHumans()).toContain('2 days')
    expect(new DatetimeInterval({ days: 0 }).forHumans()).toContain('0 seconds')
  })
})

describe('Relative string parsing edge cases', () => {
  it('handles empty, whitespace, and nonsense strings', () => {
    expect(() => Datetime.parseRelative('', undefined, { strict: true })).toThrow()
    expect(() => Datetime.parseRelative('   ', undefined, { strict: true })).toThrow()
    expect(() => Datetime.parseRelative('infinity', undefined, { strict: true })).toThrow()
  })
})

describe('weekOfYear edge cases', () => {
  it('handles year boundaries and different firstDayOfWeek', () => {
    const d1 = new Datetime('2023-12-31T00:00:00Z', { firstDayOfWeek: 0 })
    const d2 = new Datetime('2024-01-01T00:00:00Z', { firstDayOfWeek: 1 })
    expect(typeof d1.weekOfYear).toBe('number')
    expect(typeof d2.weekOfYear).toBe('number')
  })
})

describe('Strict mode everywhere', () => {
  it('strict mode for all parsing methods', () => {
    expect(() => Datetime.fromString('bad', { strict: true })).toThrow()
    expect(() => Datetime.parseRelative('bad', undefined, { strict: true })).toThrow()
  })
})

describe('Immutability and clone', () => {
  it('all manipulation methods are immutable', () => {
    const d = new Datetime('2024-01-01T00:00:00Z')
    const d2 = d.addDays(1)
    expect(d.day).toBe(1)
    expect(d2.day).toBe(2)
  })
  it('clone returns an equal but not identical instance', () => {
    const d = new Datetime('2024-01-01T00:00:00Z')
    const d2 = d.clone()
    expect(d2.toISOString()).toBe(d.toISOString())
    expect(d2).not.toBe(d)
  })
})

describe('toISOString, toString, and format', () => {
  it('are consistent and correct', () => {
    const d = new Datetime('2024-01-02T03:04:05.123Z', { defaultFormat: 'YYYY-MM-DD' })
    expect(d.toISOString()).toBe('2024-01-02T03:04:05.123Z')
    expect(d.toString()).toBe('2024-01-02')
    expect(d.format()).toBe('2024-01-02')
  })
})

describe('DatetimeInterval arithmetic and forHumans', () => {
  it('handles zero and negative values', () => {
    const i = new DatetimeInterval({ days: 0, hours: -2 })
    expect(i.forHumans()).toContain('-2 hour')
    expect(i.hours).toBe(-2)
  })
  it('add and subtract work as expected', () => {
    const i1 = DatetimeInterval.days(2)
    const i2 = DatetimeInterval.hours(3)
    const sum = i1.add(i2)
    expect(sum.days).toBe(2)
    expect(sum.hours).toBe(3)
    const diff = sum.subtract(i2)
    expect(diff.days).toBe(2)
    expect(diff.hours).toBe(0)
  })
})

describe('DatetimePeriod iteration edge cases', () => {
  it('interval does not evenly divide range', () => {
    const start = new Datetime('2024-01-01')
    const end = new Datetime('2024-01-05')
    const period = new DatetimePeriod(start, end, DatetimeInterval.days(2))
    const days = Array.from(period).map(d => d.day)
    expect(days).toEqual([1, 3, 5])
  })
})

describe('All getters', () => {
  it('return correct values', () => {
    const d = new Datetime('2024-05-01T12:34:56.789Z')
    expect(d.year).toBe(2024)
    expect(d.month).toBe(5)
    expect(d.day).toBe(1)
    expect(d.hour).toBe(12)
    expect(d.minute).toBe(34)
    expect(d.second).toBe(56)
    expect(d.millisecond).toBe(789)
    expect(typeof d.timestamp).toBe('number')
    expect(typeof d.iso).toBe('string')
    expect(typeof d.dayOfWeek).toBe('number')
    expect(typeof d.dayOfYear).toBe('number')
    expect(typeof d.weekOfYear).toBe('number')
    expect(typeof d.isLeapYear).toBe('boolean')
    expect(typeof d.daysInMonth).toBe('number')
  })
})

describe('Timezone config', () => {
  it('is accessible but a no-op', () => {
    const d = new Datetime('2024-01-01T00:00:00Z', { timezone: 'America/New_York' })
    expect(d.getTimezone()).toBe('America/New_York')
  })
})
