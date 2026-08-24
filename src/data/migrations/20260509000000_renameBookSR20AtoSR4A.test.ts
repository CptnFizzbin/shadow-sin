import { describe, expect, it } from "vitest"

import migration from "./20260509000000_renameBookSR20AtoSR4A.ts"

describe.concurrent("013_renameBookSR20AtoSR4A", () => {
  it("does nothing when character has no source-bearing fields", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("renames SR20A to SR4A in a gear item", () => {
    // Arrange
    const character = {
      gear: {
        "item-1": { source: { book: "SR20A", page: 42 } },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.["item-1"].source?.book).toBe("SR4A")
  })

  it("leaves other book values in gear unchanged", () => {
    // Arrange
    const character = {
      gear: {
        "item-1": { source: { book: "AR", page: 10 } },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.["item-1"].source?.book).toBe("AR")
  })

  it("renames SR20A to SR4A in a spell", () => {
    // Arrange
    const character = {
      spells: [{ id: "spell-1", source: { book: "SR20A", page: 100 } }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.[0].source?.book).toBe("SR4A")
  })

  it("renames SR20A to SR4A in a quality", () => {
    // Arrange
    const character = {
      qualities: [{ id: "quality-1", source: { book: "SR20A", page: 80 } }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].source?.book).toBe("SR4A")
  })

  it("renames SR20A to SR4A in an adept power", () => {
    // Arrange
    const character = {
      adeptPowers: [{ id: "power-1", source: { book: "SR20A", page: 170 } }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.adeptPowers?.[0].source?.book).toBe("SR4A")
  })

  it("renames SR20A to SR4A in a sprite", () => {
    // Arrange
    const character = {
      sprites: [{ id: "sprite-1", source: { book: "SR20A", page: 200 } }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.sprites?.[0].source?.book).toBe("SR4A")
  })

  it("skips items without a source field", () => {
    // Arrange
    const character = {
      spells: [{ id: "spell-no-source" }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.[0]).not.toHaveProperty("source")
  })

  it("renames SR20A across multiple collections in one pass", () => {
    // Arrange
    const character = {
      gear: { "g-1": { source: { book: "SR20A", page: 1 } } },
      spells: [{ id: "s-1", source: { book: "SR20A", page: 2 } }, { id: "s-2", source: { book: "SM", page: 3 } }],
      qualities: [{ id: "q-1", source: { book: "SR20A", page: 4 } }],
      adeptPowers: [{ id: "p-1", source: { book: "AU", page: 5 } }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.["g-1"].source?.book).toBe("SR4A")
    expect(result.spells?.[0].source?.book).toBe("SR4A")
    expect(result.spells?.[1].source?.book).toBe("SM")
    expect(result.qualities?.[0].source?.book).toBe("SR4A")
    expect(result.adeptPowers?.[0].source?.book).toBe("AU")
  })
})
