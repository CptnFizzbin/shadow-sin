import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { ItemType } from "#/system/itemType.ts"

import { isAvailable, isEquipped, isStashed } from "./itemUtils.ts"

const baseItem = { id: NullUuid, name: "Test Item", itemType: ItemType.other }

// isEquipped/isStashed are deprecated thin wrappers over the top-level fields — the gear reducer
// (not these functions) is what enforces that a stashed item's `equipped` is false, so these just
// echo whatever the field holds.
describe("isEquipped (deprecated)", () => {
  it("returns true when the item's equipped field is true", () => {
    expect(isEquipped({ ...baseItem, equipped: true })).toBe(true)
  })

  it("returns false when equipped is false or absent", () => {
    expect(isEquipped({ ...baseItem, equipped: false })).toBe(false)
    expect(isEquipped(baseItem)).toBe(false)
  })
})

describe("isStashed (deprecated)", () => {
  it("returns true when the item's stashed field is true", () => {
    expect(isStashed({ ...baseItem, stashed: true })).toBe(true)
  })

  it("returns false when stashed is false or absent", () => {
    expect(isStashed({ ...baseItem, stashed: false })).toBe(false)
    expect(isStashed(baseItem)).toBe(false)
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
