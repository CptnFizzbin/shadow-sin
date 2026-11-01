import { describe, expect, test } from "vitest"

import { AvailabilityFormulas } from "./availabilityFormulas.ts"

describe.concurrent("AvailabilityFormulas.getTestInterval", () => {
  test.each([
    { cost: 0, expected: { hours: 12 } },
    { cost: 100, expected: { hours: 12 } },
    { cost: 101, expected: { days: 1 } },
    { cost: 1_000, expected: { days: 1 } },
    { cost: 1_001, expected: { days: 2 } },
    { cost: 10_000, expected: { days: 2 } },
    { cost: 10_001, expected: { weeks: 1 } },
    { cost: 250_000, expected: { weeks: 1 } },
  ])("uses an interval of $expected for an item costing $cost¥", ({ cost, expected }) => {
    // Arrange / Act
    const interval = AvailabilityFormulas.getTestInterval(cost)

    // Assert
    expect(interval).toEqual(expected)
  })
})
