import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellType,
} from "#/system/magic/spellData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { selectAllGameEffects, selectGameEffectsByType, useGameEffects } from "./useGameEffects.ts"

// ---------------------------------------------------------------------------
// selectAllGameEffects
// ---------------------------------------------------------------------------

describe("selectAllGameEffects", () => {
  it("returns an empty array when no source has effects", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act
    const effects = selectAllGameEffects({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toEqual([])
  })

  it("collects effects from qualities", () => {
    // Arrange
    const sheet = runnerDataFactory({ override: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Analytical Mind",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
      return s
    } })

    // Act
    const effects = selectAllGameEffects({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 })
  })

  it("collects effects from equipped gear", () => {
    // Arrange
    const [synapticBooster] = createItem({
      name: "Synaptic Booster",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.initiativeBonus, value: 1 }],
    })
    const sheet = runnerDataFactory({ items: createItemMap([synapticBooster]) })

    // Act
    const effects = selectAllGameEffects({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.initiativeBonus, value: 1 })
  })

  it("ignores effects from unequipped gear", () => {
    // Arrange
    const [synapticBooster] = createItem({
      name: "Synaptic Booster",
      itemType: ItemType.implant,
      equipped: false,
      effects: [{ type: GameEffectType.initiativeBonus, value: 1 }],
    })
    const sheet = runnerDataFactory({ items: createItemMap([synapticBooster]) })

    // Act
    const effects = selectAllGameEffects({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toEqual([])
  })

  it("collects effects from spells", () => {
    // Arrange
    const sheet = runnerDataFactory({ override: (s) => {
      s.spells = [
        {
          kind: EntityKind.spell,
          id: NullUuid,
          name: "Increase Reflexes",
          type: SpellType.Physical,
          range: SpellRange.Touch,
          damage: SpellDamage.Stun,
          category: SpellCategory.Health,
          drain: { type: SpellDrainType.Force, value: 0 },
          dealsDamage: false,
          duration: SpellDuration.Sustained,
          voluntaryTargetsOnly: false,
          effects: [{ type: GameEffectType.initiativeBonus, value: 2 }],
        },
      ]
      return s
    } })

    // Act
    const effects = selectAllGameEffects({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.initiativeBonus, value: 2 })
  })

  it("collects effects from complex forms", () => {
    // Arrange
    const sheet = runnerDataFactory({ override: (s) => {
      s.complexForms = [
        {
          kind: EntityKind.complexForm,
          id: NullUuid,
          name: "Resonance Spike",
          rating: 3,
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.resonance, value: 1 }],
        },
      ]
      return s
    } })

    // Act
    const effects = selectAllGameEffects({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.attrMod, target: AttributeKey.resonance })
  })

  it("collects effects from adept powers", () => {
    // Arrange
    const sheet = runnerDataFactory({ override: (s) => {
      s.powers = [
        {
          kind: EntityKind.adeptPower,
          type: "adeptPower",
          id: NullUuid,
          name: "Killing Hands",
          rating: 1,
          costPerRating: 0.5,
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.strength, value: 1 }],
        },
      ]
      return s
    } })

    // Act
    const effects = selectAllGameEffects({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.attrMod, target: AttributeKey.strength })
  })

  it("collects and flattens effects from all sources", () => {
    // Arrange
    const [implant] = createItem({
      name: "Wired Reflexes",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.initiativeBonus, value: 1 }],
    })
    const sheet = runnerDataFactory({ override: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Analytical Mind",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
      s.gear = createItemMap([implant])
      s.powers = [
        {
          kind: EntityKind.adeptPower,
          type: "adeptPower",
          id: NullUuid,
          name: "Killing Hands",
          rating: 1,
          costPerRating: 0.5,
          effects: [{ type: GameEffectType.recoilReduction, value: 1 }],
        },
      ]
      return s
    } })

    // Act
    const effects = selectAllGameEffects({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toHaveLength(3)
  })

  it("handles sources with no effects field gracefully", () => {
    // Arrange
    const sheet = runnerDataFactory({ override: (s) => {
      s.qualities = [{ kind: EntityKind.quality, id: NullUuid, name: "Toughness", type: "positive" }]
      s.powers = [{ kind: EntityKind.adeptPower, type: "adeptPower", id: NullUuid, name: "Killing Hands", rating: 1, costPerRating: 0.5 }]
      return s
    } })

    // Act
    const effects = selectAllGameEffects({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// selectGameEffectsByType
// ---------------------------------------------------------------------------

describe("selectGameEffectsByType", () => {
  it("returns an empty array when there are no effects of that type", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act
    const effects = selectGameEffectsByType(GameEffectType.attrMod)({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toEqual([])
  })

  it("returns only effects matching the requested type", () => {
    // Arrange
    const sheet = runnerDataFactory({ override: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Aptitude",
          type: "positive",
          effects: [
            { type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 },
            { type: GameEffectType.initiativeBonus, value: 1 },
          ],
        },
      ]
      return s
    } })

    // Act
    const attrModEffects = selectGameEffectsByType(GameEffectType.attrMod)({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(attrModEffects).toHaveLength(1)
    expect(attrModEffects[0]).toMatchObject({ type: GameEffectType.attrMod, target: AttributeKey.logic })
  })

  it("collects matching effects across multiple sources", () => {
    // Arrange
    const [implant] = createItem({
      name: "Wired Reflexes",
      itemType: ItemType.implant,
      equipped: true,
      effects: [{ type: GameEffectType.initiativeBonus, value: 1 }],
    })
    const sheet = runnerDataFactory({ override: (s) => {
      s.spells = [
        {
          kind: EntityKind.spell,
          id: NullUuid,
          name: "Increase Reflexes",
          type: SpellType.Physical,
          range: SpellRange.Touch,
          damage: SpellDamage.Stun,
          category: SpellCategory.Health,
          drain: { type: SpellDrainType.Force, value: 0 },
          dealsDamage: false,
          duration: SpellDuration.Sustained,
          voluntaryTargetsOnly: false,
          effects: [{ type: GameEffectType.initiativeBonus, value: 2 }],
        },
      ]
      s.gear = createItemMap([implant])
      return s
    } })

    // Act
    const initiativeEffects = selectGameEffectsByType(GameEffectType.initiativeBonus)({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(initiativeEffects).toHaveLength(2)
    expect(initiativeEffects.map((e) => e.value)).toEqual(expect.arrayContaining([1, 2]))
  })
})

// ---------------------------------------------------------------------------
// useGameEffects
// ---------------------------------------------------------------------------

describe("useGameEffects", () => {
  it("returns an empty array when there are no matching effects on the sheet", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act
    const { result } = renderHook(() => useGameEffects(GameEffectType.attrMod), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toEqual([])
  })

  it("returns effects of the requested type from the runner sheet", () => {
    // Arrange
    const sheet = runnerDataFactory({ override: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Aptitude",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
      return s
    } })

    // Act
    const { result } = renderHook(() => useGameEffects(GameEffectType.attrMod), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 })
  })

  it("does not return effects of other types", () => {
    // Arrange
    const sheet = runnerDataFactory({ override: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Aptitude",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
      return s
    } })

    // Act
    const { result } = renderHook(() => useGameEffects(GameEffectType.initiativeBonus), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toEqual([])
  })
})
