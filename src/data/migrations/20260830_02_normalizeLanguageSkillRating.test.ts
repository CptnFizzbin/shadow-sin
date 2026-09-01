import { describe, expect, it } from "vitest"

import migration from "./20260830_02_normalizeLanguageSkillRating.ts"

describe.concurrent("normalizeLanguageSkillRating", () => {
  it("returns the character unchanged when there are no language skills", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("converts a native language's sentinel rating to isNative: true with no rating", () => {
    // Arrange
    const character = { skills: { languageSkills: [{ name: "English", rating: "native" }] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.skills?.languageSkills?.[0]).toEqual({ name: "English", isNative: true })
  })

  it("converts a learned language's numeric rating to isNative: false, keeping the rating", () => {
    // Arrange
    const character = { skills: { languageSkills: [{ name: "Elven", rating: 3 }] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.skills?.languageSkills?.[0]).toEqual({ name: "Elven", isNative: false, rating: 3 })
  })

  it("is idempotent — a skill already carrying isNative is left untouched", () => {
    // Arrange
    const character = { skills: { languageSkills: [{ name: "Elven", isNative: false, rating: 3 }] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.skills?.languageSkills?.[0]).toEqual({ name: "Elven", isNative: false, rating: 3 })
  })

  it("preserves an optional lingo field untouched", () => {
    // Arrange
    const character = { skills: { languageSkills: [{ name: "Elven", rating: 3, lingo: "Tir Tairngire" }] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.skills?.languageSkills?.[0]).toEqual({
      name: "Elven",
      isNative: false,
      rating: 3,
      lingo: "Tir Tairngire",
    })
  })
})
