import { describe, expect, it } from "vitest"

import migration from "./012_nestSpellDrain.ts"

describe("012_nestSpellDrain", () => {
  it("does nothing when spells array is absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).not.toHaveProperty("spells")
  })

  it("does nothing when spells array is empty", () => {
    // Arrange
    const character = { spells: [] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells).toEqual([])
  })

  it("converts a force-based spell from flat to nested drain", () => {
    // Arrange
    const character = {
      spells: [{ id: "abc", drainBaseType: "Force", drainValueMod: -1 }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.[0].drain).toEqual({ type: "Force", value: -1 })
    expect(result.spells?.[0]).not.toHaveProperty("drainBaseType")
    expect(result.spells?.[0]).not.toHaveProperty("drainValueMod")
  })

  it("converts a fixed-base spell using drainBaseValue as drain.value", () => {
    // Arrange
    const character = {
      spells: [{ id: "def", drainBaseType: "Fixed", drainBaseValue: 5, drainValueMod: 0 }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.[0].drain).toEqual({ type: "Fixed", value: 5 })
    expect(result.spells?.[0]).not.toHaveProperty("drainBaseType")
    expect(result.spells?.[0]).not.toHaveProperty("drainBaseValue")
    expect(result.spells?.[0]).not.toHaveProperty("drainValueMod")
  })

  it("defaults to Force type when drainBaseType is absent", () => {
    // Arrange
    const character = {
      spells: [{ id: "ghi", drainValueMod: 2 }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.[0].drain).toEqual({ type: "Force", value: 2 })
    expect(result.spells?.[0]).not.toHaveProperty("drainValueMod")
  })

  it("skips spells that already have the nested drain field", () => {
    // Arrange
    const character = {
      spells: [{ id: "jkl", drain: { type: "Force", value: 3 } }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.[0].drain).toEqual({ type: "Force", value: 3 })
  })

  it("handles a mixed array — migrates old, preserves already-migrated", () => {
    // Arrange
    const character = {
      spells: [
        { id: "a", drainBaseType: "Force", drainValueMod: 0 },
        { id: "b", drain: { type: "Fixed", value: 4 } },
        { id: "c", drainBaseType: "Force", drainValueMod: -1 },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.[0].drain).toEqual({ type: "Force", value: 0 })
    expect(result.spells?.[1].drain).toEqual({ type: "Fixed", value: 4 })
    expect(result.spells?.[2].drain).toEqual({ type: "Force", value: -1 })
  })

  it("does nothing when _meta_.version is already at or past this migration", () => {
    // Arrange
    const character = {
      _meta_: { version: 12 },
      spells: [{ id: "abc", drainBaseType: "Force", drainValueMod: -1 }],
    }

    // Act
    const result = migration.up(character)

    // Assert — the spell was left in its old flat drain shape
    expect(result.spells?.[0]).not.toHaveProperty("drain")
  })
})
