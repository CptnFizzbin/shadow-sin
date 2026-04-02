import { describe, expect, it } from "vitest"

import { GameEffectType } from "./GameEffectType.ts"

describe("GameEffectType", () => {
  it("has the expected string values", () => {
    expect(GameEffectType.initiativeBonus).toBe("initiativeBonus")
    expect(GameEffectType.recoilReduction).toBe("recoilReduction")
    expect(GameEffectType.dicePoolMod).toBe("dicePoolMod")
    expect(GameEffectType.attrMod).toBe("attrMod")
    expect(GameEffectType.skillMod).toBe("skillMod")
    expect(GameEffectType.extraInitiativePasses).toBe("extraInitiativePasses")
    expect(GameEffectType.painTolerance).toBe("painTolerance")
  })

  it("contains exactly 7 members", () => {
    // Guard against accidental additions or removals
    expect(Object.values(GameEffectType)).toHaveLength(7)
  })

  it("does not contain the legacy attrBonus value", () => {
    // Regression: attrBonus was removed and replaced with attrMod
    const values = Object.values(GameEffectType) as string[]
    expect(values).not.toContain("attrBonus")
  })

  it("does not contain the legacy skillBonus value", () => {
    // Regression: skillBonus was removed and replaced with skillMod
    const values = Object.values(GameEffectType) as string[]
    expect(values).not.toContain("skillBonus")
  })

  it("does not contain the legacy setModifier value", () => {
    // Regression: setModifier was removed
    const values = Object.values(GameEffectType) as string[]
    expect(values).not.toContain("setModifier")
  })

  it("attrMod is the value used for attribute modifications (not attrBonus)", () => {
    // This specifically guards the rename from attrBonus -> attrMod
    expect(GameEffectType.attrMod).toBeDefined()
    expect(GameEffectType.attrMod).toBe("attrMod")
  })
})
