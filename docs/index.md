---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "ts-datetime"
  text: "Modern TypeScript DateTime Library."
  tagline: "Immutable, fluent, and fully-typed. Inspired by Carbon."
  image: /images/logo-white.png
  actions:
    - theme: brand
      text: Get Started
      link: /intro
    - theme: alt
      text: View on GitHub
      link: https://github.com/stacksjs/ts-datetime

features:
  - title: "Immutable & Fluent API"
    icon: "🕒"
    details: "All operations return new instances. Chainable and expressive."
  - title: "Locale & Config Support"
    icon: "🌍"
    details: "Global, per-instance, and per-call configuration for locale, formatting, and more."
  - title: "Robust Parsing"
    icon: "📅"
    details: "Supports ISO, timestamps, relative strings (e.g. 'next week', '+2 days'), and strict mode."
  - title: "Intervals & Periods"
    icon: "⏳"
    details: "Built-in support for durations and date ranges."
  - title: "TypeScript First"
    icon: "🦾"
    details: "Fully typed, with great DX in modern editors."
  - title: "Tested & Reliable"
    icon: "✅"
    details: "Thoroughly tested for edge cases and correctness."
---

<Home />
