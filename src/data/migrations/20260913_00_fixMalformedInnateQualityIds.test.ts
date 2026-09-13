import { describe, expect, it } from "vitest"

import migration from "./20260913_00_fixMalformedInnateQualityIds.ts"

describe.concurrent("fixMalformedInnateQualityIds", () => {
  it("returns the character unchanged when there are no qualities", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("remaps the old malformed Vanish id to the corrected id", () => {
    // Arrange
    const character = { qualities: [{ id: "6c1d4e5f-7a8b-9c0d-1e2f-3a4b5c6d7e8f", name: "Vanish" }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].id).toBe("364b1c68-15fa-45ef-8c4c-621498a05d72")
  })

  it("remaps the old malformed Uneducated id to the corrected id", () => {
    // Arrange
    const character = { qualities: [{ id: "7d2e5f6a-8b9c-0d1e-2f3a-4b5c6d7e8f9a", name: "Uneducated" }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].id).toBe("38d53d59-5237-4a50-9f34-29aebb478218")
  })

  it("backfills a fresh valid id onto any other malformed id", () => {
    // Arrange
    const character = { qualities: [{ id: "not-a-uuid", name: "Homemade Quality" }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].id).toEqual(expect.any(String))
    expect(result.qualities?.[0].id).not.toBe("not-a-uuid")
  })

  it("leaves an already-valid quality id untouched", () => {
    // Arrange
    const validId = "c0623cb3-58d1-4344-86c3-38e9ad6985cb"
    const character = { qualities: [{ id: validId, name: "Computer Illiterate" }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].id).toBe(validId)
  })

  it("assigns distinct fresh ids to multiple qualities with the same malformed id shape", () => {
    // Arrange
    const character = { qualities: [{ id: "bad-id-1" }, { id: "bad-id-2" }] }

    // Act
    const result = migration.up(character)

    // Assert
    const ids = result.qualities?.map((quality) => quality.id)
    expect(ids?.[0]).not.toBe(ids?.[1])
  })

  it("is idempotent — running it again on already-fixed qualities is a no-op", () => {
    // Arrange
    const character = { qualities: [{ id: "364b1c68-15fa-45ef-8c4c-621498a05d72", name: "Vanish" }] }

    // Act
    const once = migration.up(character)
    const twice = migration.up(once)

    // Assert
    expect(twice.qualities?.[0].id).toBe("364b1c68-15fa-45ef-8c4c-621498a05d72")
  })
})
