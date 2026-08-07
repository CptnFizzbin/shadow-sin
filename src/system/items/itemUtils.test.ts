import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { ItemType } from "#/system/itemType.ts"

import { isAvailable, isEquipped, isStashed } from "./itemUtils.ts"

const baseItem = { id: NullUuid, name: "Test Item", itemType: ItemType.other }

describe("isEquipped", () => {
  it("returns true when the item's _state.equipped field is true", () => {
    expect(isEquipped({ ...baseItem, _state: { equipped: true } })).toBe(true)
  })

  it("returns false when _state.equipped is false or absent", () => {
    expect(isEquipped({ ...baseItem, _state: { equipped: false } })).toBe(false)
    expect(isEquipped({ ...baseItem, _state: {} })).toBe(false)
    expect(isEquipped(baseItem)).toBe(false)
  })
})

describe("isStashed", () => {
  it("returns true when the item's _state.stashed field is true", () => {
    expect(isStashed({ ...baseItem, _state: { stashed: true } })).toBe(true)
  })

  it("returns false when _state.stashed is false or absent", () => {
    expect(isStashed({ ...baseItem, _state: { stashed: false } })).toBe(false)
    expect(isStashed({ ...baseItem, _state: {} })).toBe(false)
    expect(isStashed(baseItem)).toBe(false)
  })

  it("is independent of _state.equipped — stashing does not depend on equip state", () => {
    expect(isStashed({ ...baseItem, _state: { equipped: true, stashed: true } })).toBe(true)
    expect(isStashed({ ...baseItem, _state: { equipped: true, stashed: false } })).toBe(false)
  })
})

describe("isAvailable", () => {
  it("is true when the item is not stashed", () => {
    expect(isAvailable(baseItem)).toBe(true)
    expect(isAvailable({ ...baseItem, _state: { equipped: true } })).toBe(true)
  })

  it("is false when the item is stashed", () => {
    expect(isAvailable({ ...baseItem, _state: { stashed: true } })).toBe(false)
  })

  it("stays true regardless of equipped state on its own", () => {
    expect(isAvailable({ ...baseItem, _state: { equipped: false } })).toBe(true)
  })
})
