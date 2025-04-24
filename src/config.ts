import type { DatetimeConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaultConfig: DatetimeConfig = {
  locale: 'en',
  verbose: true,
  timezone: 'UTC',
  strict: false,
  firstDayOfWeek: 0,
  defaultFormat: 'YYYY-MM-DDTHH:mm:ssZ',
  parseLocale: 'en',
}

// eslint-disable-next-line antfu/no-top-level-await
export const config: DatetimeConfig = await loadConfig({
  name: 'datetime',
  defaultConfig,
})
