import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { ItemType } from "#/system/itemType.ts"
import { SpellCategory } from "#/system/magic/spellData.ts"

import type { FocusData } from "./focusData.ts"
import { FocusDataSchema, FocusType, isFocusData } from "./focusData.ts"

describe("FocusDataSchema", () => {
  it("parses a minimal valid Power focus", () => {
    const data = {
      id: crypto.randomUUID(),
      name: "Power Focus",
      itemType: ItemType.focus,
      focusType: FocusType.Power,
    }

    const parsed = FocusDataSchema.parse(data)

    expect(parsed.focusType).toBe(FocusType.Power)
    expect(parsed.itemType).toBe(ItemType.focus)
  })

  it("rejects an unknown focusType", () => {
    const data = {
      id: crypto.randomUUID(),
      name: "Bogus",
      itemType: ItemType.focus,
      focusType: "Mystery",
    }

    expect(() => FocusDataSchema.parse(data)).toThrow()
  })

  it("rejects an itemType other than focus", () => {
    const data = {
      id: crypto.randomUUID(),
      name: "Armor",
      itemType: ItemType.armor,
      focusType: FocusType.Power,
    }

    expect(() => FocusDataSchema.parse(data)).toThrow()
  })

  it("round-trips a sustaining focus with spellCategory and slottedSpellId", () => {
    const slottedSpellId = crypto.randomUUID()
    const data = {
      id: crypto.randomUUID(),
      name: "Sustaining (Combat)",
      itemType: ItemType.focus,
      focusType: FocusType.Sustaining,
      spellCategory: SpellCategory.Combat,
      slottedSpellId,
      bonded: true,
      equipped: true,
      rating: 3,
    }

    const parsed = FocusDataSchema.parse(data)

    expect(parsed.spellCategory).toBe(SpellCategory.Combat)
    expect(parsed.slottedSpellId).toBe(slottedSpellId)
    expect(parsed.bonded).toBe(true)
    expect(parsed.equipped).toBe(true)
    expect(parsed.rating).toBe(3)
  })
})

describe("isFocusData", () => {
  it("returns true for a focus item", () => {
    const focus: FocusData = {
      id: crypto.randomUUID() as UUID,
      name: "Test",
      itemType: ItemType.focus,
      focusType: FocusType.Centering,
    }
    expect(isFocusData(focus)).toBe(true)
  })

  it("returns false for a non-focus item", () => {
    expect(isFocusData({
      id: crypto.randomUUID() as UUID,
      name: "Armor",
      itemType: ItemType.armor,
    })).toBe(false)
  })
})
