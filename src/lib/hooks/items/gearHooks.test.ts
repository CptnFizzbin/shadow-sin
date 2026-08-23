import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { searchGear } from "./gearHooks.ts"

const idA = "00000000-0000-0000-0000-00000000000a"
const idB = "00000000-0000-0000-0000-00000000000b"
const idParent = "00000000-0000-0000-0000-0000000000a1"
const idChild = "00000000-0000-0000-0000-0000000000a2"
const idChild1 = "00000000-0000-0000-0000-0000000000b1"
const idChild2 = "00000000-0000-0000-0000-0000000000b2"
const idOther = "00000000-0000-0000-0000-0000000000c1"

function makeItem(overrides: Partial<ItemData> & Pick<ItemData, "id" | "name">): ItemData {
  return { kind: EntityKind.item, items: { parentId: null, childIds: [] }, itemType: ItemType.other, ...overrides }
}

describe.concurrent("searchGear", () => {
  it("returns every item when there are no search terms", () => {
    // Arrange
    const gear = {
      [idA]: makeItem({ id: idA, name: "Trodes" }),
      [idB]: makeItem({ id: idB, name: "Commlink" }),
    }

    // Act / Assert
    expect(searchGear(gear, [])).toHaveLength(2)
  })

  it("matches case-insensitive substrings in the name", () => {
    // Arrange
    const gear = {
      [idA]: makeItem({ id: idA, name: "Ares Predator" }),
      [idB]: makeItem({ id: idB, name: "Commlink" }),
    }

    // Act
    const result = searchGear(gear, ["predator"])

    // Assert
    expect(result.map((i) => i.id)).toEqual([idA])
  })

  it("matches substrings in the description when the name doesn't match", () => {
    // Arrange
    const gear = {
      [idA]: makeItem({ id: idA, name: "Mystery Box", description: "Contains a Predator pistol" }),
    }

    // Act
    const result = searchGear(gear, ["predator"])

    // Assert
    expect(result.map((i) => i.id)).toEqual([idA])
  })

  it("requires every term to match (AND, not OR)", () => {
    // Arrange
    const gear = {
      [idA]: makeItem({ id: idA, name: "Ares Predator" }),
      [idB]: makeItem({ id: idB, name: "Ares Alpha" }),
    }

    // Act
    const result = searchGear(gear, ["ares", "predator"])

    // Assert
    expect(result.map((i) => i.id)).toEqual([idA])
  })

  it("includes a matching child's parent for context", () => {
    // Arrange
    const gear = {
      [idParent]: makeItem({ id: idParent, name: "Ares Predator", items: { parentId: null, childIds: [idChild] } }),
      [idChild]: makeItem({ id: idChild, name: "Smartgun System", items: { parentId: idParent, childIds: [] } }),
      [idOther]: makeItem({ id: idOther, name: "Commlink" }),
    }

    // Act
    const result = searchGear(gear, ["smartgun"])

    // Assert
    expect(new Set(result.map((i) => i.id))).toEqual(new Set([idParent, idChild]))
  })

  it("includes all children of a directly-matching parent", () => {
    // Arrange
    const gear = {
      [idParent]: makeItem({ id: idParent, name: "Ares Predator", items: { parentId: null, childIds: [idChild1, idChild2] } }),
      [idChild1]: makeItem({ id: idChild1, name: "Smartgun System", items: { parentId: idParent, childIds: [] } }),
      [idChild2]: makeItem({ id: idChild2, name: "Silencer", items: { parentId: idParent, childIds: [] } }),
      [idOther]: makeItem({ id: idOther, name: "Commlink" }),
    }

    // Act
    const result = searchGear(gear, ["predator"])

    // Assert
    expect(new Set(result.map((i) => i.id))).toEqual(new Set([idParent, idChild1, idChild2]))
  })

  it("returns nothing when no item matches", () => {
    // Arrange
    const gear = { [idA]: makeItem({ id: idA, name: "Commlink" }) }

    // Act / Assert
    expect(searchGear(gear, ["predator"])).toEqual([])
  })
})
