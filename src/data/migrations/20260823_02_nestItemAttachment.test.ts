import { describe, expect, it } from "vitest"

import migration from "./20260823_02_nestItemAttachment.ts"

describe.concurrent("029_nestItemAttachment", () => {
  it("backfills RunnerData's own degenerate items field when absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.items).toEqual({ parentId: null, childIds: [] })
  })

  it("preserves an existing RunnerData items field", () => {
    // Arrange
    const character = { items: { parentId: null, childIds: [] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.items).toEqual({ parentId: null, childIds: [] })
  })

  it("nests an item's parentId/childIds under items", () => {
    // Arrange
    const parentId = crypto.randomUUID()
    const childId = crypto.randomUUID()
    const character = {
      _data_: {
        items: {
          a1: { parentId, childIds: [childId] },
        },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.a1.items).toEqual({ parentId, childIds: [childId] })
  })

  it("removes the item's top-level parentId/childIds fields", () => {
    // Arrange
    const character = {
      _data_: {
        items: {
          a1: { parentId: crypto.randomUUID(), childIds: [crypto.randomUUID()] },
        },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.a1).not.toHaveProperty("parentId")
    expect(result._data_?.items?.a1).not.toHaveProperty("childIds")
  })

  it("defaults a root item's items field to { parentId: null, childIds: [] } when absent", () => {
    // Arrange
    const character = {
      _data_: {
        items: {
          a1: {},
        },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.a1.items).toEqual({ parentId: null, childIds: [] })
  })

  it("is a no-op when _data_.items is absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_).toBeUndefined()
  })
})
