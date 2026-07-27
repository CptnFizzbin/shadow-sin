import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { select } from "./houseRulesSlice.selectors.ts"

describe("select", () => {
  it("returns true for the known items.licenseCheck.ratingPlusRating key", () => {
    const sheet = runnerDataFactory()

    expect(select("items.licenseCheck.ratingPlusRating")(sheet)).toBe(true)
  })

  it("returns false for an unknown key", () => {
    const sheet = runnerDataFactory()

    expect(select("unknown.key")(sheet)).toBe(false)
  })
})
