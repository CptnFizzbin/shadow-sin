import { describe, expect, it } from "vitest"

import { isMagician, SpellsBpPerSpell } from "#/components/CharacterBuilder/Sections/Resources/Magician/SpellsUtils.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

describe("SpellsBpPerSpell constant", () => {
  it("costs 3 BP per spell", () => {
    expect(SpellsBpPerSpell).toBe(3)
  })
})

describe("isMagician", () => {
  it("returns true for Magician awakening", () => {
    expect(isMagician(AwakeningType.Magician)).toBe(true)
  })

  it("returns true for MysticAdept awakening", () => {
    expect(isMagician(AwakeningType.MysticAdept)).toBe(true)
  })

  it("returns false for Adept awakening", () => {
    expect(isMagician(AwakeningType.Adept)).toBe(false)
  })

  it("returns false for Mundane awakening", () => {
    expect(isMagician(AwakeningType.Mundane)).toBe(false)
  })

  it("returns false for Technomancer awakening", () => {
    expect(isMagician(AwakeningType.Technomancer)).toBe(false)
  })
})
