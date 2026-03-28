import { describe, expect, it } from "vitest"

import {
  getAdeptPowerBpCost,
  isAdept,
} from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersUtils.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"
import type { AdeptPowerData } from "#/lib/system/magic/adeptPowerData.ts"

function makePower(
  overrides: Partial<AdeptPowerData> & { rating: number, costPerRating: number },
): AdeptPowerData {
  return {
    id: "test-power",
    name: "Attribute Boost",
    ...overrides,
  }
}

describe("isAdept", () => {
  it("returns true for Adept awakening", () => {
    expect(isAdept(AwakeningType.Adept)).toBe(true)
  })

  it("returns true for MysticAdept awakening", () => {
    expect(isAdept(AwakeningType.MysticAdept)).toBe(true)
  })

  it("returns false for Magician awakening", () => {
    expect(isAdept(AwakeningType.Magician)).toBe(false)
  })

  it("returns false for Mundane awakening", () => {
    expect(isAdept(AwakeningType.Mundane)).toBe(false)
  })

  it("returns false for Technomancer awakening", () => {
    expect(isAdept(AwakeningType.Technomancer)).toBe(false)
  })
})

describe("getAdeptPowerBpCost", () => {
  it("returns rating × costPerRating", () => {
    expect(getAdeptPowerBpCost(makePower({ rating: 3, costPerRating: 0.5 }))).toBeCloseTo(1.5)
  })

  it("returns 0 for a zero-cost power", () => {
    expect(getAdeptPowerBpCost(makePower({ rating: 5, costPerRating: 0 }))).toBe(0)
  })

  it("handles integer costs correctly", () => {
    expect(getAdeptPowerBpCost(makePower({ rating: 2, costPerRating: 1 }))).toBe(2)
  })
})
