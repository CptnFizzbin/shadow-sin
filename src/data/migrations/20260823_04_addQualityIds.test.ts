import { describe, expect, it } from "vitest"

import migration from "./20260823_04_addQualityIds.ts"

describe.concurrent("031_addQualityIds", () => {
  it("returns the character unchanged when there are no qualities", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("backfills an id onto a quality missing one", () => {
    // Arrange
    const character = { qualities: [{}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].id).toEqual(expect.any(String))
  })

  it("leaves a quality's existing id untouched", () => {
    // Arrange
    const character = { qualities: [{ id: "existing-id" }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].id).toBe("existing-id")
  })

  it("assigns distinct ids to multiple qualities missing one", () => {
    // Arrange
    const character = { qualities: [{}, {}] }

    // Act
    const result = migration.up(character)

    // Assert
    const ids = result.qualities?.map((quality) => quality.id)
    expect(ids?.[0]).toEqual(expect.any(String))
    expect(ids?.[1]).toEqual(expect.any(String))
    expect(ids?.[0]).not.toBe(ids?.[1])
  })
})
