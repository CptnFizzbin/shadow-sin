import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import migration from "./20260823_01_moveItems.ts"

// Minimal ItemData satisfying today's shape — this migration only moves `gear` wholesale, so the
// item's own fields beyond `itemType` are irrelevant to what's under test.
const armorItem: ItemData = {
  kind: EntityKind.item,
  id: "a1",
  name: "Armor",
  itemType: ItemType.armor,
  items: { parentId: null, childIds: [] },
}

describe.concurrent("028_moveItems", () => {
  it("moves gear into _data_.items", () => {
    // Arrange
    const character = {
      gear: {
        a1: armorItem,
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_.items).toEqual({ a1: armorItem })
  })

  it("removes the top-level gear field", () => {
    // Arrange
    const character = {
      gear: {
        a1: armorItem,
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).not.toHaveProperty("gear")
  })

  it("defaults _data_.items to an empty object when gear is absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_.items).toEqual({})
  })

  it("moves featureFlags into _data_.featureFlags", () => {
    // Arrange
    const character = {
      featureFlags: { optionalRules: { encumbranceEnabled: true } },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_.featureFlags).toEqual({ optionalRules: { encumbranceEnabled: true } })
  })

  it("removes the top-level featureFlags field", () => {
    // Arrange
    const character = {
      featureFlags: { optionalRules: { encumbranceEnabled: true } },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).not.toHaveProperty("featureFlags")
  })

  it("defaults _data_.featureFlags to an empty object when featureFlags is absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_.featureFlags).toEqual({})
  })

  it("is idempotent — running it twice preserves an already-migrated runner's _data_", () => {
    // Arrange
    const character = {
      gear: { a1: armorItem },
      featureFlags: { optionalRules: { encumbranceEnabled: true } },
    }

    // Act
    const once = migration.up(character)
    const twice = migration.up(once)

    // Assert — a second run must not overwrite the real _data_ with empty objects
    expect(twice._data_).toEqual(once._data_)
    expect(twice._data_.items).toEqual({ a1: armorItem })
    expect(twice._data_.featureFlags).toEqual({ optionalRules: { encumbranceEnabled: true } })
  })
})
