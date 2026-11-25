import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import { MagicalType } from "#/system/model/items/magicalData.ts"
import { FocusType } from "#/system/model/magic/focusData.ts"
import { SpellCategory, SpellDuration, SpellSustainTarget } from "#/system/model/magic/spellData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { getSustainingFocus, hasSpellEffects, isSustainable, spellEffectsApply, sustainingPenalty } from "./spellSustaining.ts"

const makeSustainingFocus = (overrides: Partial<FocusData> = {}): FocusData => ({
  kind: EntityKind.item,
  id: crypto.randomUUID() as UUID,
  name: "Sustaining Focus",
  itemType: ItemType.magical,
  magicalType: MagicalType.focus,
  focusType: FocusType.Sustaining,
  force: 3,
  spellCategory: SpellCategory.Health,
  bonded: true,
  state: ItemState.available,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

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

describe.concurrent("sustainingPenalty", () => {
  it("is -2 for each sustained spell, whoever it is sustained on", () => {
    // Arrange
    const spells = [
      { duration: SpellDuration.Sustained, sustained: true, category: SpellCategory.Health },
      { duration: SpellDuration.Sustained, sustained: true, category: SpellCategory.Health, sustainedOn: SpellSustainTarget.Other },
    ]

    // Act
    const penalty = sustainingPenalty(spells, [])

    // Assert
    expect(penalty).toBe(-4)
  })

  it("ignores spells that aren't being sustained", () => {
    // Arrange
    const spells = [
      { duration: SpellDuration.Sustained, sustained: false, category: SpellCategory.Health },
      { duration: SpellDuration.Sustained, category: SpellCategory.Health },
      { duration: SpellDuration.Instantaneous, sustained: true, category: SpellCategory.Health },
    ]

    // Act
    const penalty = sustainingPenalty(spells, [])

    // Assert
    expect(penalty).toBe(0)
  })

  it("leaves out a spell held by a Sustaining Focus", () => {
    // Arrange
    const focus = makeSustainingFocus()
    const spells = [
      { duration: SpellDuration.Sustained, sustained: true, category: SpellCategory.Health, sustainedBy: focus.id },
      { duration: SpellDuration.Sustained, sustained: true, category: SpellCategory.Health },
    ]

    // Act
    const penalty = sustainingPenalty(spells, [focus])

    // Assert
    expect(penalty).toBe(-2)
  })

  it("counts a spell whose focus can no longer hold it", () => {
    // Arrange
    const focus = makeSustainingFocus({ state: ItemState.stashed })
    const spells = [
      { duration: SpellDuration.Sustained, sustained: true, category: SpellCategory.Health, sustainedBy: focus.id },
    ]

    // Act
    const penalty = sustainingPenalty(spells, [focus])

    // Assert
    expect(penalty).toBe(-2)
  })
})

describe.concurrent("getSustainingFocus", () => {
  it("finds the focus holding the spell", () => {
    // Arrange
    const focus = makeSustainingFocus()

    // Act
    const result = getSustainingFocus({ category: SpellCategory.Health, sustainedBy: focus.id }, [focus])

    // Assert
    expect(result).toBe(focus)
  })

  it.each([null, undefined])("is undefined when sustainedBy is %s", (sustainedBy) => {
    // Arrange
    const focus = makeSustainingFocus()

    // Act
    const result = getSustainingFocus({ category: SpellCategory.Health, sustainedBy }, [focus])

    // Assert
    expect(result).toBeUndefined()
  })

  it("is undefined when the named focus is gone", () => {
    // Arrange / Act
    const result = getSustainingFocus({ category: SpellCategory.Health, sustainedBy: crypto.randomUUID() }, [])

    // Assert
    expect(result).toBeUndefined()
  })
})
