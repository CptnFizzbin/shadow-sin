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

import { GameEffectSelectors } from "./useGameEffects.ts"

// ---------------------------------------------------------------------------
// GameEffectSelectors.selectAll
// ---------------------------------------------------------------------------

describe("GameEffectSelectors.selectAll", () => {
  it("returns an empty array when no source has effects", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act
    const effects = GameEffectSelectors.selectAll({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toEqual([])
  })

  it("collects effects from qualities", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Analytical Mind",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
    } })

    // Act
    const effects = GameEffectSelectors.selectAll({ runner: sheet, items: getItemCatalog(sheet) })

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
    const effects = GameEffectSelectors.selectAll({ runner: sheet, items: getItemCatalog(sheet) })

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
    const effects = GameEffectSelectors.selectAll({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toEqual([])
  })

  it("collects effects from spells", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
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
    } })

    // Act
    const effects = GameEffectSelectors.selectAll({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.initiativeBonus, value: 2 })
  })

  it("collects effects from complex forms", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.complexForms = [
        {
          kind: EntityKind.complexForm,
          id: NullUuid,
          name: "Resonance Spike",
          rating: 3,
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.resonance, value: 1 }],
        },
      ]
    } })

    // Act
    const effects = GameEffectSelectors.selectAll({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.attrMod, target: AttributeKey.resonance })
  })

  it("collects effects from adept powers", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
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
    } })

    // Act
    const effects = GameEffectSelectors.selectAll({ runner: sheet, items: getItemCatalog(sheet) })

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
    const sheet = runnerDataFactory({
      items: createItemMap([implant]),
      afterBuild: (s) => {
        s.qualities = [
          {
            kind: EntityKind.quality,
            id: NullUuid,
            name: "Analytical Mind",
            type: "positive",
            effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
          },
        ]
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
      },
    })

    // Act
    const effects = GameEffectSelectors.selectAll({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toHaveLength(3)
  })

  it("handles sources with no effects field gracefully", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [{ kind: EntityKind.quality, id: NullUuid, name: "Toughness", type: "positive" }]
      s.powers = [{ kind: EntityKind.adeptPower, type: "adeptPower", id: NullUuid, name: "Killing Hands", rating: 1, costPerRating: 0.5 }]
    } })

    // Act
    const effects = GameEffectSelectors.selectAll({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(effects).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// GameEffectSelectors.selectByType
// ---------------------------------------------------------------------------

describe("GameEffectSelectors.selectByType", () => {
  it("returns an empty array when there are no effects of that type", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act
    const effects = GameEffectSelectors.selectByType(
      { runner: sheet, items: getItemCatalog(sheet) },
      { gameEffectType: GameEffectType.attrMod },
    )

    // Assert
    expect(effects).toEqual([])
  })

  it("returns only effects matching the requested type", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
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
    } })

    // Act
    const attrModEffects = GameEffectSelectors.selectByType(
      { runner: sheet, items: getItemCatalog(sheet) },
      { gameEffectType: GameEffectType.attrMod },
    )

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
    const sheet = runnerDataFactory({
      items: createItemMap([implant]),
      afterBuild: (s) => {
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
      },
    })

    // Act
    const initiativeEffects = GameEffectSelectors.selectByType(
      { runner: sheet, items: getItemCatalog(sheet) },
      { gameEffectType: GameEffectType.initiativeBonus },
    )

    // Assert
    expect(initiativeEffects).toHaveLength(2)
    expect(initiativeEffects.map((e) => e.value)).toEqual(expect.arrayContaining([1, 2]))
  })
})
