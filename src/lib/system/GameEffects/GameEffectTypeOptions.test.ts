import { describe, expect, it } from "vitest"

import { DamageTrackKey } from "#/lib/system/DamageTrackKey.ts"
import { GameEffectType } from "#/lib/system/GameEffects/GameEffectType.ts"
import { GameEffectTypeOptions } from "#/lib/system/GameEffects/GameEffectTypeOptions.ts"
import { AttributeKey, AttributeLabels } from "#/lib/system/attributeKey.ts"

describe("GameEffectTypeOptions", () => {
  it("contains an entry for every GameEffectType enum value", () => {
    // Arrange
    const allTypes = Object.values(GameEffectType)
    const optionValues = GameEffectTypeOptions.map((o) => o.value)

    // Act / Assert
    for (const type of allTypes) {
      expect(optionValues).toContain(type)
    }
  })

  it("has no duplicate effect type entries", () => {
    // Arrange / Act
    const values = GameEffectTypeOptions.map((o) => o.value)
    const uniqueValues = new Set(values)

    // Assert
    expect(values.length).toBe(uniqueValues.size)
  })

  it("every option has a non-empty label and a value", () => {
    // Arrange / Act / Assert
    for (const option of GameEffectTypeOptions) {
      expect(typeof option.label).toBe("string")
      expect(option.label.length).toBeGreaterThan(0)
      expect(typeof option.value).toBe("string")
      expect(option.value.length).toBeGreaterThan(0)
    }
  })

  describe("attrMod option", () => {
    it("has targets array with all AttributeKey values", () => {
      // Arrange
      const attrModOption = GameEffectTypeOptions.find((o) => o.value === GameEffectType.attrMod)

      // Act
      const targetValues = attrModOption!.targets!.map((t) => t.value)

      // Assert
      const allAttrKeys = Object.values(AttributeKey)
      for (const attrKey of allAttrKeys) {
        expect(targetValues).toContain(attrKey)
      }
    })

    it("uses AttributeLabels as labels for attribute targets", () => {
      // Arrange
      const attrModOption = GameEffectTypeOptions.find((o) => o.value === GameEffectType.attrMod)

      // Act / Assert
      for (const target of attrModOption!.targets!) {
        const expectedLabel = AttributeLabels[target.value as AttributeKey]
        if (expectedLabel !== undefined) {
          expect(target.label).toBe(expectedLabel)
        }
      }
    })
  })

  describe("skillMod option", () => {
    it("has a non-empty targets array", () => {
      // Arrange
      const skillModOption = GameEffectTypeOptions.find((o) => o.value === GameEffectType.skillMod)

      // Assert
      expect(skillModOption!.targets).toBeDefined()
      expect(skillModOption!.targets!.length).toBeGreaterThan(0)
    })

    it("skill targets have matching label and value", () => {
      // Arrange
      const skillModOption = GameEffectTypeOptions.find((o) => o.value === GameEffectType.skillMod)

      // Act / Assert - skill labels should equal the skill key value
      for (const target of skillModOption!.targets!) {
        expect(target.label).toBe(target.value)
      }
    })
  })

  describe("dicePoolMod option", () => {
    it("has a non-empty targets array", () => {
      // Arrange
      const dicePoolModOption = GameEffectTypeOptions.find((o) => o.value === GameEffectType.dicePoolMod)

      // Assert
      expect(dicePoolModOption!.targets).toBeDefined()
      expect(dicePoolModOption!.targets!.length).toBeGreaterThan(0)
    })
  })

  describe("painTolerance option", () => {
    it("has targets including 'all' and all DamageTrackKey values", () => {
      // Arrange
      const painToleranceOption = GameEffectTypeOptions.find((o) => o.value === GameEffectType.painTolerance)

      // Act
      const targetValues = painToleranceOption!.targets!.map((t) => t.value)

      // Assert
      expect(targetValues).toContain("all")
      expect(targetValues).toContain(DamageTrackKey.physical)
      expect(targetValues).toContain(DamageTrackKey.stun)
      expect(targetValues).toContain(DamageTrackKey.matrix)
    })

    it("'all' target appears before damage track keys", () => {
      // Arrange
      const painToleranceOption = GameEffectTypeOptions.find((o) => o.value === GameEffectType.painTolerance)

      // Act
      const targetValues = painToleranceOption!.targets!.map((t) => t.value)
      const allIndex = targetValues.indexOf("all")
      const physicalIndex = targetValues.indexOf(DamageTrackKey.physical)

      // Assert
      expect(allIndex).toBe(0)
      expect(physicalIndex).toBeGreaterThan(allIndex)
    })
  })

  describe("options without targets", () => {
    it("initiativeBonus has no targets", () => {
      // Arrange
      const option = GameEffectTypeOptions.find((o) => o.value === GameEffectType.initiativeBonus)

      // Assert
      expect(option).toBeDefined()
      expect(option!.targets).toBeUndefined()
    })

    it("extraInitiativePasses has no targets", () => {
      // Arrange
      const option = GameEffectTypeOptions.find((o) => o.value === GameEffectType.extraInitiativePasses)

      // Assert
      expect(option).toBeDefined()
      expect(option!.targets).toBeUndefined()
    })

    it("recoilReduction has no targets", () => {
      // Arrange
      const option = GameEffectTypeOptions.find((o) => o.value === GameEffectType.recoilReduction)

      // Assert
      expect(option).toBeDefined()
      expect(option!.targets).toBeUndefined()
    })
  })
})
