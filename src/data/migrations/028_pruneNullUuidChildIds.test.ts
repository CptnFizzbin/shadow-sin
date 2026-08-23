import { describe, expect, it } from "vitest"

import migration from "./028_pruneNullUuidChildIds.ts"

const NULL_UUID = "00000000-0000-0000-0000-000000000000"

describe.concurrent("028_pruneNullUuidChildIds", () => {
  it("returns the character unchanged when there is no gear", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("removes the null uuid from an item's childIds", () => {
    // Arrange
    const character = {
      gear: {
        i1: { itemType: "implant", childIds: [NULL_UUID] },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.i1.childIds).toEqual([])
  })

  it("keeps real child ids alongside a removed null uuid", () => {
    // Arrange
    const character = {
      gear: {
        i1: { itemType: "implant", childIds: [NULL_UUID, "accessory-1"] },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.i1.childIds).toEqual(["accessory-1"])
  })

  it("leaves items without a null uuid child id alone", () => {
    // Arrange
    const character = {
      gear: {
        i1: { itemType: "implant", childIds: ["accessory-1"] },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.i1.childIds).toEqual(["accessory-1"])
  })

  it("leaves items without childIds alone", () => {
    // Arrange
    const character = {
      gear: {
        i1: { itemType: "implant" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.i1.childIds).toBeUndefined()
  })
})
