// Datetime.ts - Carbon-inspired datetime library for TypeScript

import type { DatetimeConfig } from './types'
import { config as globalConfig } from './config'

export type DatetimeInput = string | number | Date | Datetime

// --- Locale system ---
interface Locale {
  justNow: string
  ago: (n: number, unit: string) => string
  in: (n: number, unit: string) => string
  units: {
    year: string
    month: string
    day: string
    hour: string
    minute: string
    second: string
    ms: string
  }
  interval: (parts: string[]) => string
}

const locales: { [key: string]: Locale } = {
  en: {
    justNow: 'just now',
    ago: (n: number, unit: string) => `${n} ${unit}${n !== 1 ? 's' : ''} ago`,
    in: (n: number, unit: string) => `in ${n} ${unit}${n !== 1 ? 's' : ''}`,
    units: {
      year: 'year',
      month: 'month',
      day: 'day',
      hour: 'hour',
      minute: 'minute',
      second: 'second',
      ms: 'ms',
    },
    interval: (parts: string[]) => parts.length ? parts.join(' ') : '0 seconds',
  },
  // Add more locales here
}

let globalLocale = 'en'

export class Datetime {
  public _date: Date
  private _locale?: string
  private _config?: Partial<DatetimeConfig>

  /**
   * Create a new Datetime instance.
   * @param input - The date/time input.
   * @param config - Optional per-instance config overrides.
   */
  constructor(input?: DatetimeInput, config?: Partial<DatetimeConfig>) {
    if (!input) {
      this._date = new Date()
    }
    else if (input instanceof Datetime) {
      this._date = new Date(input._date)
    }
    else if (input instanceof Date) {
      this._date = new Date(input)
    }
    else if (typeof input === 'number') {
      this._date = new Date(input)
    }
    else if (typeof input === 'string') {
      this._date = new Date(input)
      if (Number.isNaN(this._date.getTime())) {
        // Strict mode: throw on invalid date
        if (config?.strict ?? this._config?.strict ?? globalConfig.strict) {
          throw new TypeError(`Invalid date string: ${input}`)
        }
      }
    }
    else {
      throw new TypeError('Invalid input for Datetime')
    }
    if (config)
      this._config = config
    if (config?.locale)
      this._locale = config.locale
  }

  // --- Static Constructors ---
  static now(config?: Partial<DatetimeConfig>): Datetime {
    return new Datetime(undefined, config)
  }

  static today(config?: Partial<DatetimeConfig>): Datetime {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return new Datetime(d, config)
  }

  static tomorrow(config?: Partial<DatetimeConfig>): Datetime {
    return Datetime.today(config).addDays(1)
  }

  static yesterday(config?: Partial<DatetimeConfig>): Datetime {
    return Datetime.today(config).subDays(1)
  }

  static parseRelative(str: string, base?: DatetimeInput, config?: Partial<DatetimeConfig>): Datetime {
    const b = new Datetime(base, config)
    const s = str.trim().toLowerCase()
    const relRegex = /^([+-]?\d+)\s*(year|month|week|day|hour|minute|min|second|sec|ms)s?$/
    const nextLastRegex = /^(next|last)\s+(year|month|week|day|hour|minute|min|second|sec)$/
    const relMatch = s.match(relRegex)
    if (relMatch) {
      const n = Number.parseInt(relMatch[1], 10)
      const unit = relMatch[2]
      switch (unit) {
        case 'year': return n >= 0 ? b.addYears(n) : b.subYears(-n)
        case 'month': return n >= 0 ? b.addMonths(n) : b.subMonths(-n)
        case 'week': return n >= 0 ? b.addDays(n * 7) : b.subDays(-n * 7)
        case 'day': return n >= 0 ? b.addDays(n) : b.subDays(-n)
        case 'hour': return n >= 0 ? b.addHours(n) : b.subHours(-n)
        case 'minute': case 'min': return n >= 0 ? b.addMinutes(n) : b.subMinutes(-n)
        case 'second': case 'sec': return n >= 0 ? b.addSeconds(n) : b.subSeconds(-n)
        case 'ms': return n >= 0 ? b.addMilliseconds(n) : b.subMilliseconds(-n)
      }
    }
    const nextLastMatch = s.match(nextLastRegex)
    if (nextLastMatch) {
      const dir = nextLastMatch[1]
      const unit = nextLastMatch[2]
      switch (unit) {
        case 'year': return dir === 'next' ? b.addYears(1) : b.subYears(1)
        case 'month': return dir === 'next' ? b.addMonths(1) : b.subMonths(1)
        case 'week': return dir === 'next' ? b.addDays(7) : b.subDays(7)
        case 'day': return dir === 'next' ? b.addDays(1) : b.subDays(1)
        case 'hour': return dir === 'next' ? b.addHours(1) : b.subHours(1)
        case 'minute': case 'min': return dir === 'next' ? b.addMinutes(1) : b.subMinutes(1)
        case 'second': case 'sec': return dir === 'next' ? b.addSeconds(1) : b.subSeconds(1)
      }
    }
    // Strict mode: throw on ambiguous/invalid relative string
    if (config?.strict ?? b._config?.strict ?? globalConfig.strict) {
      throw new TypeError(`Invalid or ambiguous relative date string: ${str}`)
    }
    return new Datetime(str, config)
  }

  static fromString(str: string, config?: Partial<DatetimeConfig>): Datetime {
    try {
      return Datetime.parseRelative(str, undefined, config)
    }
    catch {
      // Strict mode: throw if still invalid
      if (config?.strict ?? globalConfig.strict) {
        throw new TypeError(`Invalid date string: ${str}`)
      }
      return new Datetime(str, config)
    }
  }

  static fromTimestamp(ts: number, config?: Partial<DatetimeConfig>): Datetime {
    return new Datetime(ts, config)
  }

  static setLocale(locale: string): void {
    if (!locales[locale])
      throw new Error(`Locale not found: ${locale}`)
    globalLocale = locale
  }

  static getLocale(): string {
    // Prefer static/globalLocale, then config.locale, then 'en'
    return typeof globalLocale !== 'undefined' ? globalLocale : (globalConfig?.locale || 'en')
  }

  // --- Getters ---
  get year(): number { return this._date.getFullYear() }
  get month(): number { return this._date.getMonth() + 1 } // 1-based
  get day(): number { return this._date.getDate() }
  get hour(): number { return this._date.getHours() }
  get minute(): number { return this._date.getMinutes() }
  get second(): number { return this._date.getSeconds() }
  get millisecond(): number { return this._date.getMilliseconds() }
  get timestamp(): number { return this._date.getTime() }
  get iso(): string { return this._date.toISOString() }
  get dayOfWeek(): number { return this._date.getDay() } // 0 (Sun) - 6 (Sat)
  get dayOfYear(): number {
    const start = new Date(this.year, 0, 0)
    const diff = this._date.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }

  get weekOfYear(): number {
    // Use config.firstDayOfWeek for ISO week calculation
    const firstDay = this._config?.firstDayOfWeek ?? globalConfig.firstDayOfWeek ?? 0
    const d = new Date(Date.UTC(this.year, this._date.getMonth(), this._date.getDate()))
    let dayNum = d.getUTCDay()
    if (firstDay !== 0) {
      // Adjust so week starts on config.firstDayOfWeek
      dayNum = (dayNum - firstDay + 7) % 7
    }
    d.setUTCDate(d.getUTCDate() + 4 - (dayNum || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  get isLeapYear(): boolean {
    const y = this.year
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)
  }

  get daysInMonth(): number {
    return new Date(this.year, this.month, 0).getDate()
  }

  // --- Manipulation ---
  addDays(days: number): Datetime {
    const d = new Date(this._date)
    d.setDate(d.getDate() + days)
    return new Datetime(d, this._config)
  }

  subDays(days: number): Datetime { return this.addDays(-days) }

  addMonths(months: number): Datetime {
    const origDay = this._date.getDate()
    const d = new Date(this._date)
    d.setDate(1)
    d.setMonth(d.getMonth() + months)
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    d.setDate(Math.min(origDay, lastDay))
    return new Datetime(d, this._config)
  }

  subMonths(months: number): Datetime {
    return this.addMonths(-months)
  }

  addYears(years: number): Datetime {
    const origDay = this._date.getDate()
    const d = new Date(this._date)
    d.setDate(1)
    d.setFullYear(d.getFullYear() + years)
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    d.setDate(Math.min(origDay, lastDay))
    return new Datetime(d, this._config)
  }

  subYears(years: number): Datetime {
    return this.addYears(-years)
  }

  addHours(hours: number): Datetime {
    const d = new Date(this._date)
    d.setHours(d.getHours() + hours)
    return new Datetime(d, this._config)
  }

  subHours(hours: number): Datetime { return this.addHours(-hours) }

  addMinutes(minutes: number): Datetime {
    const d = new Date(this._date)
    d.setMinutes(d.getMinutes() + minutes)
    return new Datetime(d, this._config)
  }

  subMinutes(minutes: number): Datetime { return this.addMinutes(-minutes) }

  addSeconds(seconds: number): Datetime {
    const d = new Date(this._date)
    d.setSeconds(d.getSeconds() + seconds)
    return new Datetime(d, this._config)
  }

  subSeconds(seconds: number): Datetime { return this.addSeconds(-seconds) }

  addMilliseconds(ms: number): Datetime {
    const d = new Date(this._date)
    d.setMilliseconds(d.getMilliseconds() + ms)
    return new Datetime(d)
  }

  subMilliseconds(ms: number): Datetime { return this.addMilliseconds(-ms) }

  // --- Setters (return new instance) ---
  setYear(year: number): Datetime {
    const d = new Date(this._date)
    d.setFullYear(year)
    return new Datetime(d)
  }

  setMonth(month: number): Datetime {
    const d = new Date(this._date)
    d.setMonth(month - 1)
    return new Datetime(d)
  }

  setDay(day: number): Datetime {
    const d = new Date(this._date)
    d.setDate(day)
    return new Datetime(d)
  }

  setHour(hour: number): Datetime {
    const d = new Date(this._date)
    d.setHours(hour)
    return new Datetime(d)
  }

  setMinute(minute: number): Datetime {
    const d = new Date(this._date)
    d.setMinutes(minute)
    return new Datetime(d)
  }

  setSecond(second: number): Datetime {
    const d = new Date(this._date)
    d.setSeconds(second)
    return new Datetime(d)
  }

  setMillisecond(ms: number): Datetime {
    const d = new Date(this._date)
    d.setMilliseconds(ms)
    return new Datetime(d)
  }

  setLocale(locale: string): this {
    if (!locales[locale])
      throw new Error(`Locale not found: ${locale}`)
    this._locale = locale
    return this
  }

  getLocale(): string {
    return (this._config?.locale) || this._locale || (typeof globalLocale !== 'undefined' ? globalLocale : (globalConfig?.locale || 'en'))
  }

  // --- Start/End of units ---
  startOf(unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'): Datetime {
    let d = new Date(this._date)
    switch (unit) {
      case 'year':
        d = new Date(this.year, 0, 1, 0, 0, 0, 0)
        break
      case 'month':
        d = new Date(this.year, this.month - 1, 1, 0, 0, 0, 0)
        break
      case 'day':
        d.setHours(0, 0, 0, 0)
        break
      case 'hour':
        d.setMinutes(0, 0, 0)
        break
      case 'minute':
        d.setSeconds(0, 0)
        break
      case 'second':
        d.setMilliseconds(0)
        break
    }
    return new Datetime(d)
  }

  endOf(unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'): Datetime {
    let d: Date
    switch (unit) {
      case 'year':
        d = new Date(this.year + 1, 0, 1, 0, 0, 0, 0)
        d = new Date(d.getTime() - 1)
        break
      case 'month':
        d = new Date(this.year, this.month, 1, 0, 0, 0, 0)
        d = new Date(d.getTime() - 1)
        break
      case 'day':
        d = new Date(this.year, this.month - 1, this.day + 1, 0, 0, 0, 0)
        d = new Date(d.getTime() - 1)
        break
      case 'hour':
        d = new Date(this.year, this.month - 1, this.day, this.hour + 1, 0, 0, 0)
        d = new Date(d.getTime() - 1)
        break
      case 'minute':
        d = new Date(this.year, this.month - 1, this.day, this.hour, this.minute + 1, 0, 0)
        d = new Date(d.getTime() - 1)
        break
      case 'second':
        d = new Date(this.year, this.month - 1, this.day, this.hour, this.minute, this.second + 1, 0)
        d = new Date(d.getTime() - 1)
        break
      default:
        d = new Date(this._date)
    }
    return new Datetime(d)
  }

  // --- Formatting ---
  toString(): string {
    // Use config.defaultFormat if available
    const fmt = this._config?.defaultFormat ?? globalConfig.defaultFormat
    return this.format(fmt)
  }

  toISOString(): string {
    return this._date.toISOString()
  }

  format(fmt?: string): string {
    // Use config.defaultFormat if fmt not provided
    const formatStr = fmt || this._config?.defaultFormat || globalConfig.defaultFormat || this._date.toISOString()
    const pad = (n: number, l = 2) => n.toString().padStart(l, '0')
    const map: Record<string, string> = {
      YYYY: this.year.toString(),
      MM: pad(this.month),
      DD: pad(this.day),
      HH: pad(this.hour),
      mm: pad(this.minute),
      ss: pad(this.second),
      SSS: pad(this.millisecond, 3),
    }
    let out = formatStr
    for (const k in map) {
      out = out.replace(new RegExp(k, 'g'), map[k])
    }
    return out
  }

  // --- Comparison ---
  isBefore(other: DatetimeInput): boolean {
    return this._date.getTime() < new Datetime(other)._date.getTime()
  }

  isAfter(other: DatetimeInput): boolean {
    return this._date.getTime() > new Datetime(other)._date.getTime()
  }

  isSame(other: DatetimeInput): boolean {
    return this._date.getTime() === new Datetime(other)._date.getTime()
  }

  isBetween(a: DatetimeInput, b: DatetimeInput, inclusive = true): boolean {
    const t = this._date.getTime()
    const t1 = new Datetime(a)._date.getTime()
    const t2 = new Datetime(b)._date.getTime()
    if (inclusive)
      return t >= Math.min(t1, t2) && t <= Math.max(t1, t2)
    else
      return t > Math.min(t1, t2) && t < Math.max(t1, t2)
  }

  isSameDay(other: DatetimeInput): boolean {
    const o = new Datetime(other)
    return this.year === o.year && this.month === o.month && this.day === o.day
  }

  isSameMonth(other: DatetimeInput): boolean {
    const o = new Datetime(other)
    return this.year === o.year && this.month === o.month
  }

  isSameYear(other: DatetimeInput): boolean {
    const o = new Datetime(other)
    return this.year === o.year
  }

  // --- Human readable diff ---
  diffForHumans(other?: DatetimeInput): string {
    const locale = locales[this.getLocale()] || locales.en
    const now = other ? new Datetime(other) : Datetime.now()
    const diff = this._date.getTime() - now._date.getTime()
    const abs = Math.abs(diff)
    const isFuture = diff > 0
    const units = [
      { name: 'year', ms: 365.25 * 24 * 60 * 60 * 1000 },
      { name: 'month', ms: 30.44 * 24 * 60 * 60 * 1000 },
      { name: 'day', ms: 24 * 60 * 60 * 1000 },
      { name: 'hour', ms: 60 * 60 * 1000 },
      { name: 'minute', ms: 60 * 1000 },
      { name: 'second', ms: 1000 },
    ]
    for (const u of units) {
      const val = Math.floor(abs / u.ms)
      if (val > 0) {
        const unitName = u.name as keyof typeof locale.units
        return isFuture
          ? locale.in(val, locale.units[unitName])
          : locale.ago(val, locale.units[unitName])
      }
    }
    return locale.justNow
  }

  // --- Cloning ---
  clone(): Datetime {
    return new Datetime(this._date)
  }

  // --- Interval/Period helpers ---
  diff(other: DatetimeInput, unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'ms' = 'ms'): number {
    const ms = this._date.getTime() - (other instanceof Datetime ? other._date.getTime() : new Datetime(other)._date.getTime())
    switch (unit) {
      case 'year': return this.year - (other instanceof Datetime ? other.year : new Datetime(other).year)
      case 'month': return (this.year - (other instanceof Datetime ? other.year : new Datetime(other).year)) * 12 + (this.month - (other instanceof Datetime ? other.month : new Datetime(other).month))
      case 'day': return Math.floor(ms / (24 * 60 * 60 * 1000))
      case 'hour': return Math.floor(ms / (60 * 60 * 1000))
      case 'minute': return Math.floor(ms / (60 * 1000))
      case 'second': return Math.floor(ms / 1000)
      case 'ms': default: return ms
    }
  }

  intervalUntil(other: DatetimeInput): DatetimeInterval {
    // Only supports positive intervals, simple diff
    const ms = Math.abs(this._date.getTime() - (other instanceof Datetime ? other._date.getTime() : new Datetime(other)._date.getTime()))
    let remaining = ms
    const years = Math.floor(remaining / (365.25 * 24 * 60 * 60 * 1000))
    remaining -= years * 365.25 * 24 * 60 * 60 * 1000
    const months = Math.floor(remaining / (30.44 * 24 * 60 * 60 * 1000))
    remaining -= months * 30.44 * 24 * 60 * 60 * 1000
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
    remaining -= days * 24 * 60 * 60 * 1000
    const hours = Math.floor(remaining / (60 * 60 * 1000))
    remaining -= hours * 60 * 60 * 1000
    const minutes = Math.floor(remaining / (60 * 1000))
    remaining -= minutes * 60 * 1000
    const seconds = Math.floor(remaining / 1000)
    remaining -= seconds * 1000
    const milliseconds = remaining
    return new DatetimeInterval({ years, months, days, hours, minutes, seconds, milliseconds })
  }

  periodUntil(other: DatetimeInput, interval: DatetimeInterval = DatetimeInterval.days(1)): DatetimePeriod {
    return new DatetimePeriod(this, other, interval)
  }

  // --- Locale/Config helpers ---
  getParseLocale(): string {
    return this._config?.parseLocale || globalConfig.parseLocale || this.getLocale()
  }

  getTimezone(): string {
    // Placeholder: not implemented, but ready for future timezone support
    return this._config?.timezone || globalConfig.timezone || 'UTC'
  }

  getFirstDayOfWeek(): number {
    return this._config?.firstDayOfWeek ?? globalConfig.firstDayOfWeek ?? 0
  }

  isStrict(): boolean {
    return this._config?.strict ?? globalConfig.strict ?? false
  }

  getDefaultFormat(): string {
    return this._config?.defaultFormat || globalConfig.defaultFormat || 'YYYY-MM-DDTHH:mm:ssZ'
  }
}

// --- INTERVAL ---
export class DatetimeInterval {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number

  constructor({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 }: {
    years?: number
    months?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  } = {}) {
    this.years = years
    this.months = months
    this.days = days
    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds
    this.milliseconds = milliseconds
  }

  static years(n: number): DatetimeInterval { return new DatetimeInterval({ years: n }) }
  static months(n: number): DatetimeInterval { return new DatetimeInterval({ months: n }) }
  static days(n: number): DatetimeInterval { return new DatetimeInterval({ days: n }) }
  static hours(n: number): DatetimeInterval { return new DatetimeInterval({ hours: n }) }
  static minutes(n: number): DatetimeInterval { return new DatetimeInterval({ minutes: n }) }
  static seconds(n: number): DatetimeInterval { return new DatetimeInterval({ seconds: n }) }
  static milliseconds(n: number): DatetimeInterval { return new DatetimeInterval({ milliseconds: n }) }

  add(other: DatetimeInterval): DatetimeInterval {
    return new DatetimeInterval({
      years: this.years + other.years,
      months: this.months + other.months,
      days: this.days + other.days,
      hours: this.hours + other.hours,
      minutes: this.minutes + other.minutes,
      seconds: this.seconds + other.seconds,
      milliseconds: this.milliseconds + other.milliseconds,
    })
  }

  subtract(other: DatetimeInterval): DatetimeInterval {
    return new DatetimeInterval({
      years: this.years - other.years,
      months: this.months - other.months,
      days: this.days - other.days,
      hours: this.hours - other.hours,
      minutes: this.minutes - other.minutes,
      seconds: this.seconds - other.seconds,
      milliseconds: this.milliseconds - other.milliseconds,
    })
  }

  toMilliseconds(): number {
    // Approximate: ignores leap years, DST, etc.
    return (
      this.years * 365.25 * 24 * 60 * 60 * 1000
      + this.months * 30.44 * 24 * 60 * 60 * 1000
      + this.days * 24 * 60 * 60 * 1000
      + this.hours * 60 * 60 * 1000
      + this.minutes * 60 * 1000
      + this.seconds * 1000
      + this.milliseconds
    )
  }

  forHumans(localeKey = 'en'): string {
    const locale = locales[localeKey] || locales.en
    const parts = []
    if (this.years)
      parts.push(`${this.years} ${locale.units.year}${this.years !== 1 ? 's' : ''}`)
    if (this.months)
      parts.push(`${this.months} ${locale.units.month}${this.months !== 1 ? 's' : ''}`)
    if (this.days)
      parts.push(`${this.days} ${locale.units.day}${this.days !== 1 ? 's' : ''}`)
    if (this.hours)
      parts.push(`${this.hours} ${locale.units.hour}${this.hours !== 1 ? 's' : ''}`)
    if (this.minutes)
      parts.push(`${this.minutes} ${locale.units.minute}${this.minutes !== 1 ? 's' : ''}`)
    if (this.seconds)
      parts.push(`${this.seconds} ${locale.units.second}${this.seconds !== 1 ? 's' : ''}`)
    if (this.milliseconds)
      parts.push(`${this.milliseconds} ${locale.units.ms}`)
    return locale.interval(parts)
  }
}

// --- PERIOD ---
export class DatetimePeriod implements Iterable<Datetime> {
  start: Datetime
  end: Datetime
  interval: DatetimeInterval

  constructor(start: DatetimeInput, end: DatetimeInput, interval: DatetimeInterval = DatetimeInterval.days(1)) {
    this.start = new Datetime(start)
    this.end = new Datetime(end)
    this.interval = interval
  }

  * [Symbol.iterator](): Iterator<Datetime> {
    let current = this.start.clone()
    const end = this.end
    let yielded = false
    while (current.isBefore(end) || current.isSame(end)) {
      yield current.clone()
      yielded = true
      current = current
        .addYears(this.interval.years)
        .addMonths(this.interval.months)
        .addDays(this.interval.days)
        .addHours(this.interval.hours)
        .addMinutes(this.interval.minutes)
        .addSeconds(this.interval.seconds)
        .addMilliseconds(this.interval.milliseconds)
      if (current.isAfter(end))
        break
    }
    // If start > end, yield start once (Carbon behavior)
    if (!yielded && this.start.isAfter(this.end)) {
      yield this.start.clone()
    }
  }
}
