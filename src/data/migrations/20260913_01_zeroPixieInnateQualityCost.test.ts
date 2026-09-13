import { describe, expect, it } from "vitest"

import migration from "./20260913_01_zeroPixieInnateQualityCost.ts"

describe.concurrent("zeroPixieInnateQualityCost", () => {
  it("returns the character unchanged when there are no qualities", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("zeroes bpValue on Pixie's innate Vanish", () => {
    // Arrange
    const character = {
      qualities: [{ id: "364b1c68-15fa-45ef-8c4c-621498a05d72", name: "Vanish" }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].bpValue).toBe(0)
  })

  it("zeroes bpValue on Pixie's innate Uneducated", () => {
    // Arrange
    const character = {
      qualities: [{ id: "38d53d59-5237-4a50-9f34-29aebb478218", name: "Uneducated", bpValue: 20 }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].bpValue).toBe(0)
  })

  it("leaves a separately-taken Uneducated Quality's bpValue untouched", () => {
    // Arrange
    const character = {
      qualities: [{ id: "some-other-id", name: "Uneducated", bpValue: 20 }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].bpValue).toBe(20)
  })

  it("is idempotent — running it again is a no-op", () => {
    // Arrange
    const character = {
      qualities: [{ id: "364b1c68-15fa-45ef-8c4c-621498a05d72", name: "Vanish", bpValue: 0 }],
    }

    // Act
    const once = migration.up(character)
    const twice = migration.up(once)

    // Assert
    expect(twice.qualities?.[0].bpValue).toBe(0)
  })
})
