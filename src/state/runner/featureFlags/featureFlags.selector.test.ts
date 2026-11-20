import { describe, expect, it } from "vitest"

import { houseRules } from "#/system/model/featureFlags/houseRules.ts"
import { optionalRules } from "#/system/model/featureFlags/optionalRules.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { FeatureFlagSelectors } from "./featureFlags.selector.ts"

describe.concurrent("FeatureFlagSelectors.select", () => {
  it("returns the default for a House Rule with no override", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { flag: houseRules["items.licenseCheck.ratingPlusRating"] })

    // Assert
    expect(result).toBe(true)
  })

  it("returns true for karma.nuyenExchange by default, so buying and selling karma is on", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { flag: houseRules["karma.nuyenExchange"] })

    // Assert
    expect(result).toBe(true)
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
      draft._data_.featureFlags["houseRules.karma.nuyenExchange"] = false
    } })

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { flag: houseRules["karma.nuyenExchange"] })

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
