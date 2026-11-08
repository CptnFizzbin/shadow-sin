import { describe, expect, it } from "vitest"

import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { SpellDuration, SpellSustainTarget } from "#/system/model/magic/spellData.ts"

import { hasSpellEffects, isSustainable, spellEffectsApply } from "./spellSustaining.ts"

describe.concurrent("isSustainable", () => {
  it("is true for a Sustained-duration spell", () => {
    // Arrange
    const spell = { duration: SpellDuration.Sustained }

    // Act
    const result = isSustainable(spell)

    // Assert
    expect(result).toBe(true)
  })

  it.each([SpellDuration.Instantaneous, SpellDuration.Permanent])("is false for a %s spell", (duration) => {
    // Arrange
    const spell = { duration }

    // Act
    const result = isSustainable(spell)

    // Assert
    expect(result).toBe(false)
  })
})

describe.concurrent("hasSpellEffects", () => {
  it("is false when the spell has no effects", () => {
    // Arrange
    const spell = { effects: [] }

    // Act
    const result = hasSpellEffects(spell)

    // Assert
    expect(result).toBe(false)
  })

  it("is true when the spell has an effect", () => {
    // Arrange
    const spell = { effects: [{ type: GameEffectType.initiativeBonus, value: 1 }] }

    // Act
    const result = hasSpellEffects(spell)

    // Assert
    expect(result).toBe(true)
  })
})

describe.concurrent("spellEffectsApply", () => {
  it("does not apply a sustainable spell's effects while it isn't sustained", () => {
    // Arrange
    const spell = { duration: SpellDuration.Sustained, sustained: false }

    // Act
    const result = spellEffectsApply(spell)

    // Assert
    expect(result).toBe(false)
  })

  it("applies a sustained spell's effects when no target is recorded", () => {
    // Arrange
    const spell = { duration: SpellDuration.Sustained, sustained: true }

    // Act
    const result = spellEffectsApply(spell)

    // Assert
    expect(result).toBe(true)
  })

  it("applies a sustained spell's effects when it is sustained on Self", () => {
    // Arrange
    const spell = { duration: SpellDuration.Sustained, sustained: true, sustainedOn: SpellSustainTarget.Self }

    // Act
    const result = spellEffectsApply(spell)

    // Assert
    expect(result).toBe(true)
  })

  it("does not apply a sustained spell's effects when it is sustained on someone else", () => {
    // Arrange
    const spell = { duration: SpellDuration.Sustained, sustained: true, sustainedOn: SpellSustainTarget.Other }

    // Act
    const result = spellEffectsApply(spell)

    // Assert
    expect(result).toBe(false)
  })

  it("always applies a non-sustainable spell's effects", () => {
    // Arrange
    const spell = { duration: SpellDuration.Permanent }

    // Act
    const result = spellEffectsApply(spell)

    // Assert
    expect(result).toBe(true)
  })
})
