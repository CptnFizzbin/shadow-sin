import { describe, expect, it } from "vitest"

import { AwakeningType } from "#/lib/system/awakening-type.ts"
import type { AdeptPowerData } from "#/lib/system/magic/adept-power-data.ts"

import { getAdeptPowerBpCost, isAdept } from "#/components/AdeptPowers/adept-powers-utils.ts"

describe("isAdept", () => {
  it("returns true for Adept awakening type", () => {
    // Arrange
    const awakeningType = AwakeningType.Adept

    // Act
    const result = isAdept(awakeningType)

    // Assert
    expect(result).toBe(true)
  })

  it("returns true for MysticAdept awakening type", () => {
    // Arrange
    const awakeningType = AwakeningType.MysticAdept

    // Act
    const result = isAdept(awakeningType)

    // Assert
    expect(result).toBe(true)
  })

  it("returns false for Mundane awakening type", () => {
    // Arrange
    const awakeningType = AwakeningType.Mundane

    // Act
    const result = isAdept(awakeningType)

    // Assert
    expect(result).toBe(false)
  })

  it("returns false for Magician awakening type", () => {
    // Arrange
    const awakeningType = AwakeningType.Magician

    // Act
    const result = isAdept(awakeningType)

    // Assert
    expect(result).toBe(false)
  })

  it("returns false for Technomancer awakening type", () => {
    // Arrange
    const awakeningType = AwakeningType.Technomancer

    // Act
    const result = isAdept(awakeningType)

    // Assert
    expect(result).toBe(false)
  })
})

describe("getAdeptPowerBpCost", () => {
  it("calculates cost as rating multiplied by costPerRating", () => {
    // Arrange
    const power: AdeptPowerData = {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Improved Reflexes",
      rating: 2,
      costPerRating: 1.5,
    }

    // Act
    const result = getAdeptPowerBpCost(power)

    // Assert
    expect(result).toBe(3)
  })

  it("returns 0 when rating is 0", () => {
    // Arrange
    const power: AdeptPowerData = {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Test Power",
      rating: 0,
      costPerRating: 0.5,
    }

    // Act
    const result = getAdeptPowerBpCost(power)

    // Assert
    expect(result).toBe(0)
  })

  it("returns 0 when costPerRating is 0", () => {
    // Arrange
    const power: AdeptPowerData = {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Free Power",
      rating: 3,
      costPerRating: 0,
    }

    // Act
    const result = getAdeptPowerBpCost(power)

    // Assert
    expect(result).toBe(0)
  })

  it("handles fractional costPerRating correctly", () => {
    // Arrange
    const power: AdeptPowerData = {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Combat Sense",
      rating: 4,
      costPerRating: 0.25,
    }

    // Act
    const result = getAdeptPowerBpCost(power)

    // Assert
    expect(result).toBe(1)
  })

  it("calculates cost for rating of 1", () => {
    // Arrange
    const power: AdeptPowerData = {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Killing Hands",
      rating: 1,
      costPerRating: 1,
    }

    // Act
    const result = getAdeptPowerBpCost(power)

    // Assert
    expect(result).toBe(1)
  })
})