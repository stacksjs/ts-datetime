export interface DatetimeConfig {
  /** Enable verbose logging for debugging */
  verbose: boolean
  /** Default locale for formatting and humanization (e.g. 'en', 'fr') */
  locale: string
  /** Default timezone (e.g. 'UTC', 'America/New_York') */
  timezone?: string
  /** Strict parsing of date strings */
  strict?: boolean
  /** First day of week (0=Sunday, 1=Monday, etc.) */
  firstDayOfWeek?: number
  /** Default format string for .format()/.toString() */
  defaultFormat?: string
  /** Locale for parsing relative strings */
  parseLocale?: string
}
