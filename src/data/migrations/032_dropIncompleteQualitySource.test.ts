import { describe, expect, it } from "vitest"

import migration from "./032_dropIncompleteQualitySource.ts"

describe.concurrent("032_dropIncompleteQualitySource", () => {
  it("returns the character unchanged when there are no qualities", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("drops a source missing a page", () => {
    // Arrange
    const character = { qualities: [{ source: { book: "RC" } }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].source).toBeUndefined()
  })

  it("drops a source missing a book", () => {
    // Arrange
    const character = { qualities: [{ source: { page: 42 } }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].source).toBeUndefined()
  })

  it("leaves a complete source untouched", () => {
    // Arrange
    const character = { qualities: [{ source: { book: "SR4A", page: 95 } }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].source).toEqual({ book: "SR4A", page: 95 })
  })

  it("leaves a quality without a source untouched", () => {
    // Arrange
    const character = { qualities: [{}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].source).toBeUndefined()
  })
})
