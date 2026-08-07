import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { ItemType } from "#/system/itemType.ts"

import { isAvailable, isEquipped, isStashed } from "./itemUtils.ts"

const baseItem = { id: NullUuid, name: "Test Item", itemType: ItemType.other }

describe("isEquipped", () => {
  it("returns true when the item's equipped field is true", () => {
    expect(isEquipped({ ...baseItem, equipped: true })).toBe(true)
  })

  it("returns false when equipped is false or absent", () => {
    expect(isEquipped({ ...baseItem, equipped: false })).toBe(false)
    expect(isEquipped(baseItem)).toBe(false)
  })

  it("returns false for a stashed item even when equipped is true", () => {
    expect(isEquipped({ ...baseItem, equipped: true, stashed: true })).toBe(false)
  })
})

describe("isStashed", () => {
  it("returns true when the item's stashed field is true", () => {
    expect(isStashed({ ...baseItem, stashed: true })).toBe(true)
  })

  it("returns false when stashed is false or absent", () => {
    expect(isStashed({ ...baseItem, stashed: false })).toBe(false)
    expect(isStashed(baseItem)).toBe(false)
  })

  it("is independent of equipped — stashing does not depend on equip state", () => {
    expect(isStashed({ ...baseItem, equipped: true, stashed: true })).toBe(true)
    expect(isStashed({ ...baseItem, equipped: true, stashed: false })).toBe(false)
  })
})

describe("isAvailable", () => {
  it("is true when the item is not stashed", () => {
    expect(isAvailable(baseItem)).toBe(true)
    expect(isAvailable({ ...baseItem, equipped: true })).toBe(true)
  })

  it("is false when the item is stashed", () => {
    expect(isAvailable({ ...baseItem, stashed: true })).toBe(false)
  })

  it("stays true regardless of equipped state on its own", () => {
    expect(isAvailable({ ...baseItem, equipped: false })).toBe(true)
  })
})
