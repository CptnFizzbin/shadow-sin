import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { DicePoolId } from "#/system/model/gameEffects/dicePoolId.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import { MagicalType } from "#/system/model/items/magicalData.ts"
import { focusEffectTag, FocusType } from "#/system/model/magic/focusData.ts"
import { SpellCategory } from "#/system/model/magic/spellData.ts"
import { SpiritType } from "#/system/model/magic/spiritData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { focusEffectsApply, getBondedFociLimits, getFocusBondingCost, getFocusGameEffects } from "./focusRules.ts"

const makeFocus = (overrides: Partial<FocusData> = {}): FocusData => ({
  kind: EntityKind.item,
  id: crypto.randomUUID() as UUID,
  name: "Focus",
  itemType: ItemType.magical,
  magicalType: MagicalType.focus,
  focusType: FocusType.Power,
  force: 2,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

describe.concurrent("getFocusBondingCost", () => {
  it.each([
    [FocusType.Spellcasting, 12],
    [FocusType.Counterspelling, 9],
    [FocusType.Sustaining, 6],
    [FocusType.Summoning, 12],
    [FocusType.Banishing, 9],
    [FocusType.Binding, 9],
    [FocusType.Weapon, 9],
    [FocusType.Power, 24],
  ])("charges a Force 3 %s Focus %i Karma", (focusType, expectedCost) => {
    // Arrange
    const focus = makeFocus({ focusType, force: 3 })

    // Act
    const cost = getFocusBondingCost(focus)

    // Assert
    expect(cost).toBe(expectedCost)
  })
})

describe.concurrent("focusEffectsApply", () => {
  it.each([
    [true, ItemState.equipped, true],
    [true, ItemState.available, false],
    [true, ItemState.stashed, false],
    [false, ItemState.equipped, false],
    [undefined, ItemState.equipped, false],
  ])("for bonded=%s and state %s is %s", (bonded, state, expected) => {
    // Arrange
    const focus = makeFocus({ bonded, state })

    // Act
    const applies = focusEffectsApply(focus)

    // Assert
    expect(applies).toBe(expected)
  })
})

describe.concurrent("getFocusGameEffects", () => {
  it.each([
    [FocusType.Spellcasting, DicePoolId.spellcasting],
    [FocusType.Counterspelling, DicePoolId.counterspelling],
  ])("gives a %s Focus +Force dice to %s for its spell category", (focusType, poolId) => {
    // Arrange
    const focus = makeFocus({ focusType, force: 4, spellCategory: SpellCategory.Illusion })

    // Act
    const effects = getFocusGameEffects(focus)

    // Assert
    expect(effects).toEqual([
      { type: GameEffectType.dicePoolMod, tags: [focusEffectTag], target: poolId, subTarget: SpellCategory.Illusion, value: 4 },
    ])
  })

  it.each([
    [FocusType.Summoning, DicePoolId.summoning],
    [FocusType.Banishing, DicePoolId.banishing],
    [FocusType.Binding, DicePoolId.binding],
  ])("gives a %s Focus +Force dice to %s against its spirit type", (focusType, poolId) => {
    // Arrange
    const focus = makeFocus({ focusType, force: 2, spiritType: SpiritType.fire })

    // Act
    const effects = getFocusGameEffects(focus)

    // Assert
    expect(effects).toEqual([
      { type: GameEffectType.dicePoolMod, tags: [focusEffectTag], target: poolId, subTarget: SpiritType.fire, value: 2 },
    ])
  })

  it("gives a Weapon Focus +Force dice to attacks with the weapon it's attached to", () => {
    // Arrange
    const weaponId = crypto.randomUUID() as UUID
    const focus = makeFocus({ focusType: FocusType.Weapon, force: 3, items: { parentId: weaponId, childIds: [] } })

    // Act
    const effects = getFocusGameEffects(focus)

    // Assert
    expect(effects).toEqual([
      { type: GameEffectType.dicePoolMod, tags: [focusEffectTag], target: DicePoolId.attack, subTarget: weaponId, value: 3 },
    ])
  })

  it("gives a Power Focus +Force dice to every Magic test", () => {
    // Arrange
    const focus = makeFocus({ focusType: FocusType.Power, force: 2 })

    // Act
    const effects = getFocusGameEffects(focus)

    // Assert
    expect(effects).toEqual([{ type: GameEffectType.dicePoolMod, tags: [focusEffectTag], target: DicePoolId.magicTests, value: 2 }])
  })

  it.each([
    ["a Sustaining Focus", makeFocus({ focusType: FocusType.Sustaining, spellCategory: SpellCategory.Health })],
    ["a Spellcasting Focus with no spell category", makeFocus({ focusType: FocusType.Spellcasting })],
    ["a Summoning Focus with no spirit type", makeFocus({ focusType: FocusType.Summoning })],
    ["a Weapon Focus attached to nothing", makeFocus({ focusType: FocusType.Weapon })],
  ])("gives no effects for %s", (_label, focus) => {
    // Arrange / Act
    const effects = getFocusGameEffects(focus)

    // Assert
    expect(effects).toEqual([])
  })
})

describe.concurrent("getBondedFociLimits", () => {
  it("counts only Bonded foci against Magic and Magic × 5", () => {
    // Arrange
    const foci = [
      makeFocus({ bonded: true, force: 4 }),
      makeFocus({ bonded: true, force: 3 }),
      makeFocus({ bonded: false, force: 6 }),
    ]

    // Act
    const limits = getBondedFociLimits(foci, 2)

    // Assert
    expect(limits).toEqual({
      bondedCount: 2,
      maxBondedCount: 2,
      totalForce: 7,
      maxTotalForce: 10,
      isOverCountLimit: false,
      isOverForceLimit: false,
    })
  })

  it("flags more Bonded foci than Magic", () => {
    // Arrange
    const foci = [makeFocus({ bonded: true, force: 1 }), makeFocus({ bonded: true, force: 1 })]

    // Act
    const limits = getBondedFociLimits(foci, 1)

    // Assert
    expect(limits.isOverCountLimit).toBe(true)
    expect(limits.isOverForceLimit).toBe(false)
  })

  it("flags a combined Force above Magic × 5", () => {
    // Arrange
    const foci = [makeFocus({ bonded: true, force: 6 })]

    // Act
    const limits = getBondedFociLimits(foci, 1)

    // Assert
    expect(limits.isOverCountLimit).toBe(false)
    expect(limits.isOverForceLimit).toBe(true)
  })
})
