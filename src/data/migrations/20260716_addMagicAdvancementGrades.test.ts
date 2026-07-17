import { describe, expect, it } from "vitest"

import migration from "./20260716_addMagicAdvancementGrades.ts"

describe("20260716_addMagicAdvancementGrades", () => {
  it("defaults both grades to 0 when neither field is present", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.initiateGrade).toBe(0)
    expect(result.submersionGrade).toBe(0)
  })

  it("preserves an existing initiateGrade without overwriting it", () => {
    // Arrange
    const character = { initiateGrade: 3 }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.initiateGrade).toBe(3)
    expect(result.submersionGrade).toBe(0)
  })

  it("preserves an existing submersionGrade without overwriting it", () => {
    // Arrange
    const character = { submersionGrade: 2 }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.initiateGrade).toBe(0)
    expect(result.submersionGrade).toBe(2)
  })

  it("does not mutate the input object", () => {
    // Arrange
    const character = { initiateGrade: 1, submersionGrade: 1 }

    // Act
    migration.up(character)

    // Assert
    expect(character).toEqual({ initiateGrade: 1, submersionGrade: 1 })
  })
})
