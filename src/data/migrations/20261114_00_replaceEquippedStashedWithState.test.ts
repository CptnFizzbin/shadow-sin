import { describe, expect, it } from "vitest"

import migration from "./20261114_00_replaceEquippedStashedWithState.ts"

describe.concurrent("replaceEquippedStashedWithState", () => {
  it("stashes a stashed item, whatever its equipped flag", () => {
    // Arrange
    const character = {
      _data_: { items: { pistol: { itemType: "weapon", equipped: false, stashed: true, _state: { equipOnUnstash: true } } } },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.pistol).toEqual({ itemType: "weapon", state: "stashed" })
  })

  it("equips an equipped weapon, armor, device, or other item", () => {
    // Arrange
    const character = {
      _data_: {
        items: {
          pistol: { itemType: "weapon", equipped: true },
          jacket: { itemType: "armor", equipped: true },
          commlink: { itemType: "device", equipped: true },
          trinket: { itemType: "other", equipped: true },
        },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items).toEqual({
      pistol: { itemType: "weapon", state: "equipped" },
      jacket: { itemType: "armor", state: "equipped" },
      commlink: { itemType: "device", state: "equipped" },
      trinket: { itemType: "other", state: "equipped" },
    })
  })

  it("implants an equipped implant", () => {
    // Arrange
    const character = { _data_: { items: { wiredReflexes: { itemType: "implant", equipped: true, stashed: false } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.wiredReflexes).toEqual({ itemType: "implant", state: "implanted" })
  })

  it("makes an equipped item of a type with no active state available", () => {
    // Arrange
    const character = { _data_: { items: { sin: { itemType: "sin", equipped: true } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.sin).toEqual({ itemType: "sin", state: "available" })
  })

  it("makes an item with no equipped flag available", () => {
    // Arrange
    const character = { _data_: { items: { medkit: { itemType: "other" }, jacket: { itemType: "armor", equipped: false } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items).toEqual({
      medkit: { itemType: "other", state: "available" },
      jacket: { itemType: "armor", state: "available" },
    })
  })

  it("keeps an already-migrated state and drops leftover flags", () => {
    // Arrange
    const character = { _data_: { items: { pistol: { itemType: "weapon", state: "stashed", equipped: true } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.pistol).toEqual({ itemType: "weapon", state: "stashed" })
  })

  it("leaves a runner with no items unchanged", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })
})
