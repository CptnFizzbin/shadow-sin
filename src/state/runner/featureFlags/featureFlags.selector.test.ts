import { describe, expect, it } from "vitest"

import { houseRules } from "#/data/featureFlags/houseRules.ts"
import { optionalRules } from "#/data/featureFlags/optionalRules.ts"
import { runnerDataFactory } from "#/data/runner/runnerData.factory.ts"

import { FeatureFlagSelectors } from "./featureFlags.selector.ts"

describe.concurrent("FeatureFlagSelectors.select", () => {
  it("returns the default for a House Rule with no override", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { flag: houseRules["karma.buy.enabled"] })

    // Assert
    expect(result).toBe(true)
  })

  it("returns a number default for a numeric flag", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { flag: houseRules["karma.buy.nuyenPerKarma"] })

    // Assert
    expect(result).toBe(5000)
  })

  it("returns the default for an Optional Rule with no override", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { flag: optionalRules["items.armor.encumbrance"] })

    // Assert
    expect(result).toBe(false)
  })

  it("returns a stored override keyed by the flag's ref", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (draft) => {
      draft._data_.featureFlags["houseRules.karma.buy.enabled"] = false
    } })

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { flag: houseRules["karma.buy.enabled"] })

    // Assert
    expect(result).toBe(false)
  })

  it("falls back to the default when the stored override has the wrong type", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (draft) => {
      draft._data_.featureFlags["optionalRules.items.armor.encumbrance"] = "yes"
    } })

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { flag: optionalRules["items.armor.encumbrance"] })

    // Assert
    expect(result).toBe(false)
  })
})
