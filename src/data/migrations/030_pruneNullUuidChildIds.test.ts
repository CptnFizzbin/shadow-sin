import { describe, expect, it } from "vitest"

import migration from "./030_pruneNullUuidChildIds.ts"

const NULL_UUID = "00000000-0000-0000-0000-000000000000"

describe.concurrent("030_pruneNullUuidChildIds", () => {
  it("returns the character unchanged when there is no gear", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("removes the null uuid from an item's items.childIds", () => {
    // Arrange
    const character = {
      _data_: {
        items: {
          i1: { items: { parentId: null, childIds: [NULL_UUID] } },
        },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.i1.items?.childIds).toEqual([])
  })

  it("keeps real child ids alongside a removed null uuid", () => {
    // Arrange
    const character = {
      _data_: {
        items: {
          i1: { items: { parentId: null, childIds: [NULL_UUID, "accessory-1"] } },
        },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.i1.items?.childIds).toEqual(["accessory-1"])
  })

  it("leaves items without a null uuid child id alone", () => {
    // Arrange
    const character = {
      _data_: {
        items: {
          i1: { items: { parentId: null, childIds: ["accessory-1"] } },
        },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.i1.items?.childIds).toEqual(["accessory-1"])
  })

  it("leaves items without an items.childIds field alone", () => {
    // Arrange
    const character = {
      _data_: {
        items: {
          i1: { items: { parentId: null, childIds: [] } },
        },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.i1.items?.childIds).toEqual([])
  })
})
