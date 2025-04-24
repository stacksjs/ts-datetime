<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of ts-datetime"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# ts-datetime

A modern, immutable, and fully-typed TypeScript datetime library inspired by Carbon (PHP) and Day.js.

## Features

- 🔄 **Immutable API** _All operations return new instances_
- ⛓️ **Fluent Interface** _Chainable, readable, and expressive_
- 🌍 **Locale Support** _Global, per-instance, and per-call configuration_
- 📅 **Robust Parsing** _ISO, timestamps, relative strings (e.g. "next week", "+2 days")_
- ⏱️ **Intervals & Periods** _Built-in support for durations and date ranges_
- 💪 **TypeScript First** _Fully typed, with great DX in modern editors_
- ✅ **Tested** _Thoroughly tested for edge cases and correctness_

## Installation

```bash
# npm
npm install @stacksjs/ts-datetime

# pnpm
pnpm add @stacksjs/ts-datetime

# yarn
yarn add @stacksjs/ts-datetime

# bun
bun add @stacksjs/ts-datetime
```

## Quick Examples

```ts
import { Datetime, DatetimeInterval, DatetimePeriod } from 'ts-datetime'

// Creating dates
const now = Datetime.now()
const tomorrow = Datetime.tomorrow()
const specificDate = new Datetime('2024-01-01T12:00:00Z')

// Manipulation
const nextWeek = now.addDays(7)
const lastMonth = now.subMonths(1)

// Formatting
console.log(specificDate.format('YYYY-MM-DD')) // "2024-01-01"
console.log(now.diffForHumans()) // "just now"

// Intervals
const interval = DatetimeInterval.days(5).add(DatetimeInterval.hours(12))
console.log(interval.forHumans()) // "5 days 12 hours"

// Periods (date ranges)
const period = new DatetimePeriod(
  new Datetime('2024-01-01'),
  new Datetime('2024-01-10'),
  DatetimeInterval.days(2)
)

// Iterate over period
for (const date of period) {
  console.log(date.format('YYYY-MM-DD'))
}
// 2024-01-01, 2024-01-03, 2024-01-05, 2024-01-07, 2024-01-09
```

## Documentation

For full documentation, visit [ts-datetime.netlify.app](https://ts-datetime.netlify.app).

- [Introduction](https://ts-datetime.netlify.app/intro)
- [Installation](https://ts-datetime.netlify.app/install)
- [Usage](https://ts-datetime.netlify.app/usage)
- [Configuration](https://ts-datetime.netlify.app/config)

### Feature Documentation

- [Immutable API](https://ts-datetime.netlify.app/features/immutable-api)
- [Formatting](https://ts-datetime.netlify.app/features/formatting)
- [Intervals](https://ts-datetime.netlify.app/features/intervals)
- [Periods](https://ts-datetime.netlify.app/features/periods)
- [Human Diffs](https://ts-datetime.netlify.app/features/human-diffs)
- [Relative Strings](https://ts-datetime.netlify.app/features/relative-strings)

### Advanced Topics

- [Localization](https://ts-datetime.netlify.app/advanced/localization)
- [Type Safety](https://ts-datetime.netlify.app/advanced/type-safety)
- [Performance](https://ts-datetime.netlify.app/advanced/performance)
- [Testing](https://ts-datetime.netlify.app/advanced/testing)

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stackjs/ts-datetime/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-datetime/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@stacksjs/ts-datetime?style=flat-square
[npm-version-href]: https://npmjs.com/package/@stacksjs/ts-datetime
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-datetime/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-datetime/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-datetime/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-datetime -->
