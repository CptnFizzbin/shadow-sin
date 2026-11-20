import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { FeatureFlagSelectors } from "./featureFlags.selector.ts"

describe.concurrent("FeatureFlagSelectors.select", () => {
  it("returns the registry default for a House Rule with no override", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { key: "items.licenseCheck.ratingPlusRating" })

    // Assert
    expect(result).toBe(true)
  })

  it("returns true for karma.nuyenExchange by default, so buying and selling karma is on", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { key: "karma.nuyenExchange" })

    // Assert
    expect(result).toBe(true)
  })

  it("returns the registry default for an Optional Rule with no override", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { key: "items.armor.encumbrance" })

    // Assert
    expect(result).toBe(false)
  })

  it("returns a stored House Rule override from featureFlags.houseRules", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (draft) => {
      draft._data_.featureFlags.houseRules = { "karma.nuyenExchange": false }
    } })

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { key: "karma.nuyenExchange" })

    // Assert
    expect(result).toBe(false)
  })

  it("returns a stored Optional Rule override from featureFlags.optionalRules", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (draft) => {
      draft._data_.featureFlags.optionalRules = { "items.armor.encumbrance": true }
    } })

    // Act
    const result = FeatureFlagSelectors.select({ runner }, { key: "items.armor.encumbrance" })

    // Assert
    expect(result).toBe(true)
  })
})
