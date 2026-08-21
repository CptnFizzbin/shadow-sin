import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { HouseRulesSelectors } from "./houseRulesSlice.selectors.ts"

describe("HouseRulesSelectors.select", () => {
  it("returns true for the known items.licenseCheck.ratingPlusRating key", () => {
    const runner = runnerDataFactory()

    expect(HouseRulesSelectors.select({ runner }, { key: "items.licenseCheck.ratingPlusRating" })).toBe(true)
  })

  it("returns false for an unknown key", () => {
    const runner = runnerDataFactory()

    expect(HouseRulesSelectors.select({ runner }, { key: "unknown.key" })).toBe(false)
  })
})
