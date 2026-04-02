import { describe, expect, it } from "vitest"

import { DamageTrackKey } from "#/lib/system/DamageTrackKey.ts"
import { GameEffectType } from "#/lib/system/GameEffects/GameEffectType.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { getDefaultTarget, getTargetOptions } from "./GameEffectUtils.tsx"

describe("getTargetOptions", () => {
  it("returns target options for attrMod type", () => {
    // Arrange / Act
    const result = getTargetOptions(GameEffectType.attrMod)

    // Assert
    expect(result).not.toBeNull()
    expect(Array.isArray(result)).toBe(true)
    expect(result!.length).toBeGreaterThan(0)
  })

  it("returns attribute keys as values for attrMod type", () => {
    // Arrange / Act
    const result = getTargetOptions(GameEffectType.attrMod)

    // Assert
    const values = result!.map((o) => o.value)
    expect(values).toContain(AttributeKey.body)
    expect(values).toContain(AttributeKey.logic)
    expect(values).toContain(AttributeKey.agility)
  })

  it("returns target options for skillMod type", () => {
    // Arrange / Act
    const result = getTargetOptions(GameEffectType.skillMod)

    // Assert
    expect(result).not.toBeNull()
    expect(Array.isArray(result)).toBe(true)
    expect(result!.length).toBeGreaterThan(0)
  })

  it("returns target options for dicePoolMod type", () => {
    // Arrange / Act
    const result = getTargetOptions(GameEffectType.dicePoolMod)

    // Assert
    expect(result).not.toBeNull()
    expect(Array.isArray(result)).toBe(true)
    expect(result!.length).toBeGreaterThan(0)
  })

  it("returns target options for painTolerance type including 'all'", () => {
    // Arrange / Act
    const result = getTargetOptions(GameEffectType.painTolerance)

    // Assert
    expect(result).not.toBeNull()
    const values = result!.map((o) => o.value)
    expect(values).toContain("all")
    expect(values).toContain(DamageTrackKey.physical)
    expect(values).toContain(DamageTrackKey.stun)
    expect(values).toContain(DamageTrackKey.matrix)
  })

  it("returns null for initiativeBonus (no targets)", () => {
    // Arrange / Act
    const result = getTargetOptions(GameEffectType.initiativeBonus)

    // Assert
    expect(result).toBeNull()
  })

  it("returns null for extraInitiativePasses (no targets)", () => {
    // Arrange / Act
    const result = getTargetOptions(GameEffectType.extraInitiativePasses)

    // Assert
    expect(result).toBeNull()
  })

  it("returns null for recoilReduction (no targets)", () => {
    // Arrange / Act
    const result = getTargetOptions(GameEffectType.recoilReduction)

    // Assert
    expect(result).toBeNull()
  })

  it("returns null for an unknown effect type", () => {
    // Arrange / Act
    const result = getTargetOptions("unknownEffectType")

    // Assert
    expect(result).toBeNull()
  })

  it("returns null for an empty string", () => {
    // Arrange / Act
    const result = getTargetOptions("")

    // Assert
    expect(result).toBeNull()
  })

  it("each target option has label and value properties", () => {
    // Arrange / Act
    const result = getTargetOptions(GameEffectType.attrMod)

    // Assert
    expect(result).not.toBeNull()
    for (const option of result!) {
      expect(typeof option.label).toBe("string")
      expect(typeof option.value).toBe("string")
    }
  })
})

describe("getDefaultTarget", () => {
  it("returns DamageTrackKey.physical for painTolerance type", () => {
    // Arrange / Act
    const result = getDefaultTarget(GameEffectType.painTolerance)

    // Assert
    expect(result).toBe(DamageTrackKey.physical)
  })

  it("returns first attribute key for attrMod type", () => {
    // Arrange / Act
    const result = getDefaultTarget(GameEffectType.attrMod)

    // Assert
    // The first target in attrMod is the first AttributeKey value
    const firstAttrValue = Object.values(AttributeKey)[0]
    expect(result).toBe(firstAttrValue)
  })

  it("returns undefined for initiativeBonus (no targets)", () => {
    // Arrange / Act
    const result = getDefaultTarget(GameEffectType.initiativeBonus)

    // Assert
    expect(result).toBeUndefined()
  })

  it("returns undefined for extraInitiativePasses (no targets)", () => {
    // Arrange / Act
    const result = getDefaultTarget(GameEffectType.extraInitiativePasses)

    // Assert
    expect(result).toBeUndefined()
  })

  it("returns undefined for recoilReduction (no targets)", () => {
    // Arrange / Act
    const result = getDefaultTarget(GameEffectType.recoilReduction)

    // Assert
    expect(result).toBeUndefined()
  })

  it("returns undefined for an unknown effect type", () => {
    // Arrange / Act
    const result = getDefaultTarget("unknownEffectType")

    // Assert
    expect(result).toBeUndefined()
  })

  it("returns undefined for an empty string", () => {
    // Arrange / Act
    const result = getDefaultTarget("")

    // Assert
    expect(result).toBeUndefined()
  })

  it("returns first skill key for skillMod type", () => {
    // Arrange / Act
    const result = getDefaultTarget(GameEffectType.skillMod)

    // Assert
    expect(typeof result).toBe("string")
    expect(result!.length).toBeGreaterThan(0)
  })

  it("painTolerance returns physical even though targets list starts with 'all'", () => {
    // Regression: painTolerance has special-cased logic (not just first target)
    // Arrange / Act
    const result = getDefaultTarget(GameEffectType.painTolerance)

    // Assert - should be physical, not "all" (which is the first target in the options)
    expect(result).toBe(DamageTrackKey.physical)
    expect(result).not.toBe("all")
  })
})
