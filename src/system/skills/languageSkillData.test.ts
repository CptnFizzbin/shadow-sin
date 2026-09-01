import { describe, expect, it } from "vitest"

import { LanguageSkillDataSchema } from "./languageSkillData.ts"

describe.concurrent("LanguageSkillDataSchema", () => {
  it("validates a native language skill (isNative: true, no rating)", () => {
    // Arrange
    const skill = { name: "English", isNative: true }

    // Act
    const result = LanguageSkillDataSchema.safeParse(skill)

    // Assert
    expect(result.success).toBe(true)
  })

  it("validates a learned language skill (isNative: false, with a rating)", () => {
    // Arrange
    const skill = { name: "Elven", isNative: false, rating: 3 }

    // Act
    const result = LanguageSkillDataSchema.safeParse(skill)

    // Assert
    expect(result.success).toBe(true)
  })

  it("validates an optional lingo field", () => {
    // Arrange
    const skill = { name: "Elven", isNative: false, rating: 3, lingo: "Tir Tairngire" }

    // Act
    const result = LanguageSkillDataSchema.safeParse(skill)

    // Assert
    expect(result.success).toBe(true)
  })

  it("rejects a missing isNative flag", () => {
    // Arrange
    const skill = { name: "English", rating: 3 }

    // Act
    const result = LanguageSkillDataSchema.safeParse(skill)

    // Assert
    expect(result.success).toBe(false)
  })

  it("rejects a non-numeric rating", () => {
    // Arrange
    const skill = { name: "Elven", isNative: false, rating: "3" }

    // Act
    const result = LanguageSkillDataSchema.safeParse(skill)

    // Assert
    expect(result.success).toBe(false)
  })
})
