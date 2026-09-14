import { describe, expect, it, test } from "vitest"

import type { Duration } from "./duration.ts"
import { DurationUtils } from "./durationUtils.ts"

describe.concurrent("DurationUtils.format", () => {
  const cases = [
    {
      name: "long durations",
      duration: {
        months: 9,
        weeks: 1,
        days: 7,
        hours: 5,
        minutes: 9,
        seconds: 30,
      } as Duration,
      expected: "9 months 1 week 7 days 5 hours 9 minutes 30 seconds",
    },
    {
      name: "mixed duration with hours and minutes",
      duration: { hours: 1, minutes: 2 } as Duration,
      expected: "1 hour 2 minutes",
    },
    {
      name: "duration based only on seconds",
      duration: { seconds: 30 } as Duration,
      expected: "30 seconds",
    },
    {
      name: "duration based only on SR abstract units",
      duration: { initPasses: 10, combatRounds: 5 } as Duration,
      expected: "5 combat rounds, 10 initiative passes",
    },
    {
      name: "durations are not simplified",
      duration: {
        seconds: 95,
      } as Duration,
      expected: "95 seconds",
    },
  ]

  it.each(cases)("formats $name", ({ duration, expected }) => {
    // Arrange
    const input = duration

    // Act
    const result = DurationUtils.format(input)

    // Assert
    expect(result).toBe(expected)
  })
})

describe.concurrent("DurationUtils.simplify", () => {
  test("simplifies every period", () => {
    const interval = {
      initPasses: 100, //   =>                          100i
      combatRounds: 100, // =>                   5m  0s
      seconds: 100, //      =>                   1m 40s
      minutes: 100, //      =>               1h 40m  0s
      hours: 100, //        =>           4d  4h  0m  0s
      days: 100, //         =>   3M  2w  2d  0h  0m  0s
      weeks: 100, //        =>  25M  0w  0d  0h  0m  0s
      months: 100, //       => 100M  0w  0d  0h  0m  0s
      //                TOTAL: 128M  2w  6d  5h 46m 40s 100i
    } satisfies Duration

    expect(DurationUtils.simplify(interval)).toEqual({
      initPasses: 100,
      seconds: 40,
      minutes: 46,
      hours: 5,
      days: 6,
      weeks: 2,
      months: 128,
    })
  })
})
