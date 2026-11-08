import { describe, expect, test } from "vitest"

import type { Duration } from "#/utils/duration/duration.ts"

import { CheckFormulas } from "./checkFormulas.ts"

describe("CheckFormulas.getDuration", () => {
  test.each([
    {
      description: "multiplies each interval value by the attempt count",
      inputs: { interval: { minutes: 2 }, attempts: 3 },
      expected: { minutes: 6 },
    },
    {
      description: "keeps init passes unchanged without simplification",
      inputs: { interval: { initPasses: 2 }, attempts: 3 },
      expected: { initPasses: 6 },
    },
    {
      description: "keeps combat rounds unchanged without simplification",
      inputs: { interval: { combatRounds: 2 }, attempts: 3 },
      expected: { combatRounds: 6 },
    },
    {
      description: "keeps seconds unchanged without simplification",
      inputs: { interval: { seconds: 15 }, attempts: 2 },
      expected: { seconds: 30 },
    },
    {
      description: "keeps minutes unchanged without simplification",
      inputs: { interval: { minutes: 5 }, attempts: 2 },
      expected: { minutes: 10 },
    },
    {
      description: "keeps hours unchanged without simplification",
      inputs: { interval: { hours: 3 }, attempts: 2 },
      expected: { hours: 6 },
    },
    {
      description: "keeps days unchanged without simplification",
      inputs: { interval: { days: 4 }, attempts: 2 },
      expected: { days: 8 },
    },
    {
      description: "keeps weeks unchanged without simplification",
      inputs: { interval: { weeks: 2 }, attempts: 2 },
      expected: { weeks: 4 },
    },
    {
      description: "keeps months unchanged without simplification",
      inputs: { interval: { months: 1 }, attempts: 2 },
      expected: { months: 2 },
    },
    {
      description: "keeps init passes unchanged even when simplification is requested",
      inputs: { interval: { initPasses: 6 }, attempts: 1, simplify: true },
      expected: { initPasses: 6 },
    },
    {
      description: "simplifies combat rounds into seconds",
      inputs: { interval: { combatRounds: 2 }, attempts: 1, simplify: true },
      expected: { seconds: 6 },
    },
    {
      description: "simplifies seconds into minutes and remaining seconds",
      inputs: { interval: { seconds: 125 }, attempts: 1, simplify: true },
      expected: { minutes: 2, seconds: 5 },
    },
    {
      description: "simplifies minutes into hours and remaining minutes",
      inputs: { interval: { minutes: 125 }, attempts: 1, simplify: true },
      expected: { hours: 2, minutes: 5 },
    },
    {
      description: "simplifies hours into days and remaining hours",
      inputs: { interval: { hours: 50 }, attempts: 1, simplify: true },
      expected: { days: 2, hours: 2 },
    },
    {
      description: "simplifies days into weeks and remaining days",
      inputs: { interval: { days: 10 }, attempts: 1, simplify: true },
      expected: { weeks: 1, days: 3 },
    },
    {
      description: "simplifies weeks into months and remaining weeks",
      inputs: { interval: { weeks: 6 }, attempts: 1, simplify: true },
      expected: { months: 1, weeks: 2 },
    },
    {
      description: "leaves months unchanged when no higher unit is present",
      inputs: { interval: { months: 2 }, attempts: 1, simplify: true },
      expected: { months: 2 },
    },
  ])("$description", ({ inputs, expected }) => {
    expect(CheckFormulas.getDuration(inputs)).toEqual(expected)
  })

  test("simplifies every period", () => {
    // Arrange
    const interval = {
      initPasses: 100,
      combatRounds: 100,
      seconds: 100,
      minutes: 100,
      hours: 100,
      days: 100,
      weeks: 100,
      months: 100,
    } satisfies Duration

    // Act
    const once = CheckFormulas.getDuration({ interval, attempts: 1, simplify: true })
    const twice = CheckFormulas.getDuration({ interval, attempts: 2, simplify: true })

    // Assert
    expect(once).toEqual({
      initPasses: 100,
      seconds: 40,
      minutes: 46,
      hours: 5,
      days: 6,
      weeks: 2,
      months: 128,
    })

    expect(twice).toEqual({
      initPasses: 200,
      seconds: 20,
      minutes: 33,
      hours: 11,
      days: 5,
      weeks: 1,
      months: 257,
    })
  })
})
