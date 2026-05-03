import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDrainBaseType,
  SpellDuration,
  SpellRange,
  SpellType,
} from "#/system/magic/spellData.ts"
import { makeCharacterSheet, makeCharacterSheetWrapper } from "#testUtils/renderUtils.tsx"

import {
  selectAllGameEffects,
  selectAllGameEffectsWithSource,
  selectGameEffectsByType,
  useGameEffects,
} from "./useGameEffects.ts"

// ---------------------------------------------------------------------------
// selectAllGameEffects
// ---------------------------------------------------------------------------

describe("selectAllGameEffects", () => {
  it("returns an empty array when no source has effects", () => {
    // Arrange
    const sheet = makeCharacterSheet()

    // Act
    const effects = selectAllGameEffects(sheet)

    // Assert
    expect(effects).toEqual([])
  })

  it("collects effects from qualities", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Analytical Mind",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
    })

    // Act
    const effects = selectAllGameEffects(sheet)

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
    const sheet = makeCharacterSheet((s) => {
      s.gear = createItemMap([synapticBooster])
    })

    // Act
    const effects = selectAllGameEffects(sheet)

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
    const sheet = makeCharacterSheet((s) => {
      s.gear = createItemMap([synapticBooster])
    })

    // Act
    const effects = selectAllGameEffects(sheet)

    // Assert
    expect(effects).toEqual([])
  })

  it("collects effects from spells", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.spells = [
        {
          id: NullUuid,
          name: "Increase Reflexes",
          type: SpellType.Physical,
          range: SpellRange.Touch,
          damage: SpellDamage.Stun,
          category: SpellCategory.Health,
          drainBaseType: SpellDrainBaseType.Force,
          drainValueMod: 0,
          dealsDamage: false,
          duration: SpellDuration.Sustained,
          voluntaryTargetsOnly: false,
          effects: [{ type: GameEffectType.initiativeBonus, value: 2 }],
        },
      ]
    })

    // Act
    const effects = selectAllGameEffects(sheet)

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.initiativeBonus, value: 2 })
  })

  it("collects effects from complex forms", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.complexForms = [
        {
          id: NullUuid,
          name: "Resonance Spike",
          rating: 3,
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.resonance, value: 1 }],
        },
      ]
    })

    // Act
    const effects = selectAllGameEffects(sheet)

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.attrMod, target: AttributeKey.resonance })
  })

  it("collects effects from adept powers", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.adeptPowers = [
        {
          id: NullUuid,
          name: "Killing Hands",
          rating: 1,
          costPerRating: 0.5,
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.strength, value: 1 }],
        },
      ]
    })

    // Act
    const effects = selectAllGameEffects(sheet)

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
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Analytical Mind",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
      s.gear = createItemMap([implant])
      s.adeptPowers = [
        {
          id: NullUuid,
          name: "Killing Hands",
          rating: 1,
          costPerRating: 0.5,
          effects: [{ type: GameEffectType.recoilReduction, value: 1 }],
        },
      ]
    })

    // Act
    const effects = selectAllGameEffects(sheet)

    // Assert
    expect(effects).toHaveLength(3)
  })

  it("handles sources with no effects field gracefully", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [{ id: NullUuid, name: "Toughness", type: "positive" }]
      s.adeptPowers = [{ id: NullUuid, name: "Killing Hands", rating: 1, costPerRating: 0.5 }]
    })

    // Act
    const effects = selectAllGameEffects(sheet)

    // Assert
    expect(effects).toEqual([])
  })

  it("includes enabled temporary effects", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.temporaryEffects = [
        {
          id: "tmp1",
          label: "Team Coordination",
          enabled: true,
          type: GameEffectType.attrMod,
          target: AttributeKey.body,
          value: 2,
        },
      ]
    })

    // Act
    const effects = selectAllGameEffects(sheet)

    // Assert
    expect(effects).toHaveLength(1)
    expect(effects[0]).toMatchObject({ type: GameEffectType.attrMod, value: 2 })
  })

  it("excludes disabled temporary effects", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.temporaryEffects = [
        {
          id: "tmp1",
          label: "Disabled Bonus",
          enabled: false,
          type: GameEffectType.initiativeBonus,
          value: 1,
        },
      ]
    })

    // Act
    const effects = selectAllGameEffects(sheet)

    // Assert
    expect(effects).toEqual([])
  })

  it("handles a missing temporaryEffects field gracefully", () => {
    // Arrange
    const sheet = makeCharacterSheet()
    // Simulate a pre-migration character that lacks temporaryEffects
    const sheetWithoutField = { ...sheet, temporaryEffects: undefined }

    // Act
    const effects = selectAllGameEffects(sheetWithoutField)

    // Assert
    expect(effects).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// selectAllGameEffectsWithSource
// ---------------------------------------------------------------------------

describe("selectAllGameEffectsWithSource", () => {
  it("returns an empty array when no sources have effects", () => {
    // Arrange
    const sheet = makeCharacterSheet()

    // Act
    const entries = selectAllGameEffectsWithSource(sheet)

    // Assert
    expect(entries).toEqual([])
  })

  it("annotates quality effects with a Quality: prefix", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Analytical Mind",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
    })

    // Act
    const entries = selectAllGameEffectsWithSource(sheet)

    // Assert
    expect(entries).toHaveLength(1)
    expect(entries[0].source).toBe("Quality: Analytical Mind")
    expect(entries[0].temporaryEffectId).toBeUndefined()
  })

  it("includes all temporary effects regardless of enabled state", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.temporaryEffects = [
        {
          id: "tmp1",
          label: "Active Bonus",
          enabled: true,
          type: GameEffectType.attrMod,
          target: AttributeKey.body,
          value: 1,
        },
        {
          id: "tmp2",
          label: "Inactive Bonus",
          enabled: false,
          type: GameEffectType.initiativeBonus,
          value: 2,
        },
      ]
    })

    // Act
    const entries = selectAllGameEffectsWithSource(sheet)

    // Assert
    expect(entries).toHaveLength(2)
    expect(entries.every((entry) => entry.temporaryEffectId !== undefined)).toBe(true)
  })

  it("annotates temporary effects with a Temporary: prefix and stores the id", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.temporaryEffects = [
        {
          id: "tmp1",
          label: "Team Sync",
          enabled: true,
          type: GameEffectType.attrMod,
          target: AttributeKey.strength,
          value: 1,
        },
      ]
    })

    // Act
    const entries = selectAllGameEffectsWithSource(sheet)

    // Assert
    expect(entries[0].source).toBe("Temporary: Team Sync")
    expect(entries[0].temporaryEffectId).toBe("tmp1")
  })
})

// ---------------------------------------------------------------------------
// selectGameEffectsByType
// ---------------------------------------------------------------------------

describe("selectGameEffectsByType", () => {
  it("returns an empty array when there are no effects of that type", () => {
    // Arrange
    const sheet = makeCharacterSheet()

    // Act
    const effects = selectGameEffectsByType(GameEffectType.attrMod)(sheet)

    // Assert
    expect(effects).toEqual([])
  })

  it("returns only effects matching the requested type", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Aptitude",
          type: "positive",
          effects: [
            { type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 },
            { type: GameEffectType.initiativeBonus, value: 1 },
          ],
        },
      ]
    })

    // Act
    const attrModEffects = selectGameEffectsByType(GameEffectType.attrMod)(sheet)

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
    const sheet = makeCharacterSheet((s) => {
      s.spells = [
        {
          id: NullUuid,
          name: "Increase Reflexes",
          type: SpellType.Physical,
          range: SpellRange.Touch,
          damage: SpellDamage.Stun,
          category: SpellCategory.Health,
          drainBaseType: SpellDrainBaseType.Force,
          drainValueMod: 0,
          dealsDamage: false,
          duration: SpellDuration.Sustained,
          voluntaryTargetsOnly: false,
          effects: [{ type: GameEffectType.initiativeBonus, value: 2 }],
        },
      ]
      s.gear = createItemMap([implant])
    })

    // Act
    const initiativeEffects = selectGameEffectsByType(GameEffectType.initiativeBonus)(sheet)

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
    const sheet = makeCharacterSheet()

    // Act
    const { result } = renderHook(() => useGameEffects(GameEffectType.attrMod), {
      wrapper: makeCharacterSheetWrapper(sheet),
    })

    // Assert
    expect(result.current).toEqual([])
  })

  it("returns effects of the requested type from the character sheet", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Aptitude",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useGameEffects(GameEffectType.attrMod), {
      wrapper: makeCharacterSheetWrapper(sheet),
    })

    // Assert
    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 })
  })

  it("does not return effects of other types", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Aptitude",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useGameEffects(GameEffectType.initiativeBonus), {
      wrapper: makeCharacterSheetWrapper(sheet),
    })

    // Assert
    expect(result.current).toEqual([])
  })
})
