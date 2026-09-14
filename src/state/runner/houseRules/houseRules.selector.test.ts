import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { HouseRulesSelectors } from "./houseRules.selector.ts"

describe.concurrent("HouseRulesSelectors.select", () => {
  it("returns true for the known items.licenseCheck.ratingPlusRating key", () => {
    const runner = runnerDataFactory()

    expect(HouseRulesSelectors.select({ runner }, { key: "items.licenseCheck.ratingPlusRating" })).toBe(true)
  })

  it("returns false for an unknown key", () => {
    const runner = runnerDataFactory()

    expect(HouseRulesSelectors.select({ runner }, { key: "unknown.key" })).toBe(false)
  })
})
