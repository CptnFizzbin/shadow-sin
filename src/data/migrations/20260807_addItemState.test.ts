import { describe, expect, it } from "vitest"

import migration from "./20260807_addItemState.ts"

describe("20260807_addItemState", () => {
  it("returns the character unchanged when there is no gear", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear).toEqual({})
  })

  it("moves an item's top-level equipped value into _state.equipped, deleting the old key", () => {
    // Arrange
    const character = {
      gear: {
        w1: { id: "w1", itemType: "weapon", equipped: true },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.w1._state?.equipped).toBe(true)
    expect(result.gear?.w1.equipped).toBeUndefined()
  })

  it("moves an item's top-level stashed value into _state.stashed, deleting the old key", () => {
    // Arrange
    const character = {
      gear: {
        w1: { id: "w1", itemType: "weapon", stashed: true },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.w1._state?.stashed).toBe(true)
    expect(result.gear?.w1.stashed).toBeUndefined()
  })

  it("moves both equipped and stashed onto the same _state object", () => {
    // Arrange
    const character = {
      gear: {
        w1: { id: "w1", itemType: "weapon", equipped: true, stashed: true },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.w1._state).toEqual({ equipped: true, stashed: true })
  })

  it("preserves a false equipped value rather than dropping it", () => {
    // Arrange
    const character = {
      gear: {
        w1: { id: "w1", itemType: "weapon", equipped: false },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.w1._state?.equipped).toBe(false)
    expect(result.gear?.w1.equipped).toBeUndefined()
  })

  it("leaves items with neither field untouched", () => {
    // Arrange
    const character = {
      gear: {
        w1: { id: "w1", itemType: "weapon" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.w1._state).toBeUndefined()
  })

  it("migrates every item in a multi-item gear record independently", () => {
    // Arrange
    const character = {
      gear: {
        w1: { id: "w1", itemType: "weapon", equipped: true },
        a1: { id: "a1", itemType: "armor", equipped: false, stashed: true },
        o1: { id: "o1", itemType: "other" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.w1._state).toEqual({ equipped: true })
    expect(result.gear?.a1._state).toEqual({ equipped: false, stashed: true })
    expect(result.gear?.o1._state).toBeUndefined()
  })
})
