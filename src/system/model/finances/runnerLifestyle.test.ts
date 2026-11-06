import { describe, expect, it } from "vitest"

import { LifestyleType } from "./lifestyleType.ts"
import { lifestylePrepayCost, matchStandardLifestyle, startingNuyenLifestyle } from "./runnerLifestyle.ts"

describe.concurrent("matchStandardLifestyle", () => {
  it("matches a standard name with its standard upkeep", () => {
    // Act / Assert
    expect(matchStandardLifestyle({ name: "Low", upkeep: 2_000 })).toBe(LifestyleType.Low)
  })

  it("returns null for a standard name with a different upkeep", () => {
    // Act / Assert
    expect(matchStandardLifestyle({ name: "Low", upkeep: 2_500 })).toBeNull()
  })

  it("returns null for a custom name", () => {
    // Act / Assert
    expect(matchStandardLifestyle({ name: "Custom", upkeep: 2_000 })).toBeNull()
  })
})

describe.concurrent("startingNuyenLifestyle", () => {
  it("uses the most expensive standard lifestyle a custom upkeep covers", () => {
    // Act / Assert
    expect(startingNuyenLifestyle({ name: "Custom", upkeep: 7_500 })).toBe(LifestyleType.Middle)
  })

  it("uses Street for an income", () => {
    // Act / Assert
    expect(startingNuyenLifestyle({ name: "Trust Fund", upkeep: -5_000 })).toBe(LifestyleType.Street)
  })
})

describe.concurrent("lifestylePrepayCost", () => {
  it("multiplies upkeep by months", () => {
    // Act / Assert
    expect(lifestylePrepayCost({ upkeep: 2_000 }, 3)).toBe(6_000)
  })

  it("is zero for an income", () => {
    // Act / Assert
    expect(lifestylePrepayCost({ upkeep: -5_000 }, 3)).toBe(0)
  })
})
