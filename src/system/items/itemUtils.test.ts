import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { ItemType } from "#/system/itemType.ts"

import { isAvailable, isEquipped, isStashed } from "./itemUtils.ts"

const baseItem = { id: NullUuid, name: "Test Item", itemType: ItemType.other }

describe("isEquipped", () => {
  it("returns true when the item's equipped field is true", () => {
    expect(isEquipped({ ...baseItem, equipped: true })).toBe(true)
  })

  it("returns false when the item's equipped field is false or absent", () => {
    expect(isEquipped({ ...baseItem, equipped: false })).toBe(false)
    expect(isEquipped(baseItem)).toBe(false)
  })
})

describe("isStashed", () => {
  it("always returns false (stubbed pending #388)", () => {
    expect(isStashed(baseItem)).toBe(false)
    expect(isStashed({ ...baseItem, equipped: true })).toBe(false)
  })
})

describe("isAvailable", () => {
  it("always returns true (stubbed pending #388)", () => {
    expect(isAvailable(baseItem)).toBe(true)
    expect(isAvailable({ ...baseItem, equipped: true })).toBe(true)
  })
})
