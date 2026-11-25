import { describe, expect, it } from "vitest"

import { NullUuid } from "#common/uuid/uuidUtils.ts"
import { AttributeKey, AttrKey } from "#data/attributes/attributeKey.ts"
import { MetatypeType } from "#data/biology/metatypeData.ts"
import { EntityKind } from "#data/entities/entityKind.ts"
import { GameEffectType } from "#data/gameEffects/gameEffectType.ts"
import type { ArmorData } from "#data/items/armorData.ts"
import type { ImplantData } from "#data/items/implantData.ts"
import { ImplantType } from "#data/items/implantData.ts"
import { createItem, createItemMap } from "#data/items/itemData.ts"
import { ItemState } from "#data/items/itemState.ts"
import { ItemType } from "#data/items/itemType.ts"
import { AwakeningType } from "#data/magic/awakeningType.ts"
import type { SpellData } from "#data/magic/spellData.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellSustainTarget,
  SpellType,
} from "#data/magic/spellData.ts"
import { AccessLevel } from "#data/matrix/accessLevel.ts"
import type { KnownNode } from "#data/matrix/knownNode.ts"
import { NodeType } from "#data/matrix/nodeType.ts"
import type { AdeptPowerData } from "#data/powers/adeptPowerData.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import type { RunnerData } from "#data/runner/runnerData.ts"
import { getItemCatalog } from "#data/runner/runnerTraits.ts"

import { AttrSelectors } from "./attributes.selector.ts"

/** `AttrSelectors`' `TState` — `{ entity: EntityBase & EntityWithAttrs }` — is what
 *  `useRunnerSelector` assembles from a `RunnerData` alone (see `RunnerSelectorState` in
 *  `runnerStore.selectors.ts`); a `RunnerData` structurally satisfies both traits, so tests
 *  assemble it the same way. */
const stateFor = (runner: RunnerData) => ({
  runner: runner,
  entity: runner,
  items: getItemCatalog(runner),
})

const improvedReflexes = (reactionBonus: number): AdeptPowerData => ({
  kind: EntityKind.adeptPower,
  type: "adeptPower",
  id: "00000000-0000-4000-8000-000000000001",
  name: "Improved Reflexes",
  rating: reactionBonus,
  costPerRating: 1.5,
  effects: [{ type: GameEffectType.attrMod, target: AttributeKey.reaction, value: reactionBonus }],
})

const increaseAgility = (sustain: Pick<SpellData, "sustained" | "sustainedOn">): SpellData => ({
  kind: EntityKind.spell,
  id: NullUuid,
  name: "Increase Agility",
  type: SpellType.Physical,
  range: SpellRange.Touch,
  damage: SpellDamage.Physical,
  category: SpellCategory.Health,
  drain: { type: SpellDrainType.Force, value: -2 },
  dealsDamage: false,
  duration: SpellDuration.Sustained,
  voluntaryTargetsOnly: true,
  effects: [{ type: GameEffectType.attrMod, target: AttributeKey.agility, value: 2 }],
  ...sustain,
})

/** @deprecated - use {@link stateFor} instead */
const runnerStateFor = stateFor

describe("AttrSelectors.selectAll", () => {
  it("returns the entity's attributes record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(AttrSelectors.selectAll(stateFor(runner))).toEqual(expect.objectContaining(runner.attributes))
  })
})

describe("AttrSelectors.selectBase", () => {
  it("returns the stored value for the given key", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 6
      },
    })

    // Act / Assert
    expect(AttrSelectors.selectBase(stateFor(runner), { key: AttributeKey.agility })).toBe(6)
  })

  it("returns 0 when the key is unset", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        delete s.attributes[AttributeKey.resonance]
      },
    })

    // Act / Assert
    expect(AttrSelectors.selectBase(stateFor(runner), { key: AttributeKey.resonance })).toBe(0)
  })
})

describe("AttrSelectors.selectValue", () => {
  it("matches selectBase (no derived modifiers applied yet)", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.logic] = 3
      },
    })

    // Act / Assert
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.logic })).toBe(3)
  })
})

describe("AttrSelectors.forAttr", () => {
  it("pins selectBase to the given attribute, needing no options", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.strength] = 5
      },
    })

    // Act / Assert
    expect(AttrSelectors.forAttr(AttributeKey.strength).selectBase(stateFor(runner))).toBe(5)
  })

  it("pins selectValue to the given attribute, needing no options", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.charisma] = 7
      },
    })

    // Act / Assert
    expect(AttrSelectors.forAttr(AttributeKey.charisma).selectValue(stateFor(runner))).toBe(7)
  })

  it("doesn't leak values between attributes", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.body] = 2
        s.attributes[AttributeKey.reaction] = 9
      },
    })

    // Act / Assert
    expect(AttrSelectors.forAttr(AttributeKey.body).selectBase(stateFor(runner))).toBe(2)
    expect(AttrSelectors.forAttr(AttributeKey.reaction).selectBase(stateFor(runner))).toBe(9)
  })
})

describe("AttrSelectors.selectBounds", () => {
  it("uses the runner's metatype bounds for a physical attribute", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.biology.metatype = MetatypeType.Human
      },
    })

    // Act
    const attrs = AttrSelectors.selectBounds(runnerStateFor(runner))

    // Assert
    expect(attrs[AttributeKey.body]).toEqual({ attr: AttrKey.body, min: 1, max: 6, augMax: 9 })
  })

  it("uses the runner's awakening bounds for magic/resonance", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.biology.awakening = AwakeningType.Mundane
      },
    })

    // Act
    const attrs = AttrSelectors.selectBounds(runnerStateFor(runner))

    // Act / Assert
    expect(attrs[AttributeKey.magic]).toEqual({ attr: AttrKey.magic, min: 0, max: 0 })
  })
})

describe("AttrSelectors.selectAllInfo", () => {
  it("pairs each attribute's bounds with its base and current value", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.body] = 4
      },
    })

    // Act
    const info = AttrSelectors.selectAllInfo(runnerStateFor(runner))

    // Assert
    expect(info[AttributeKey.body]).toEqual({
      attr: AttrKey.body,
      min: 1,
      max: 6,
      augMax: 9,
      base: 4,
      baseValue: 4,
      current: 4,
      value: 4,
    })
  })
})

describe("AttrSelectors.selectInfo", () => {
  it("returns the same info as selectAllInfo for the given key", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.willpower] = 5
      },
    })

    // Act / Assert
    expect(AttrSelectors.selectInfo(runnerStateFor(runner), { key: AttributeKey.willpower }))
      .toEqual(AttrSelectors.selectAllInfo(runnerStateFor(runner))[AttributeKey.willpower])
  })
})

/** RAW's own worked example (Unwired p.167): Corvus has CHA 2, INT 5, LOG 4, WIL 3 — Rating 4,
 *  System 5, Firewall 3. */
const corvusMentalAttrs = { charisma: 2, intuition: 5, logic: 4, willpower: 3 }

const aiRunnerFor = (
  mentalAttrs: { charisma: number, intuition: number, logic: number, willpower: number },
  activeNode?: KnownNode,
): RunnerData =>
  runnerDataFactory({
    afterBuild: (s) => {
      s.biology.metatype = MetatypeType.AI
      s.biology.awakening = AwakeningType.None

      s.attributes[AttributeKey.charisma] = mentalAttrs.charisma
      s.attributes[AttributeKey.intuition] = mentalAttrs.intuition
      s.attributes[AttributeKey.logic] = mentalAttrs.logic
      s.attributes[AttributeKey.willpower] = mentalAttrs.willpower

      if (activeNode) {
        s.gameState.matrix.knownNodes = [activeNode]
        s.gameState.matrix.activeNodeId = activeNode.id
      }
    },
  })

describe("AttrSelectors.selectAllInfo — AI metatype", () => {
  it("overrides Edge's max/augMax to the computed Rating", () => {
    // Arrange
    const runner = aiRunnerFor(corvusMentalAttrs)

    // Act
    const info = AttrSelectors.selectAllInfo(stateFor(runner))

    // Assert
    expect(info[AttributeKey.edge]?.max).toBe(4)
    expect(info[AttributeKey.edge]?.augMax).toBe(4)
  })
})

const knownNodeFixture = (matrix: Partial<Record<AttributeKey, number>>): KnownNode => ({
  kind: EntityKind.matrixNode,
  id: "node-1",
  name: "Test Node",
  nodeType: NodeType.general,
  accessLevel: AccessLevel.user,
  matrix,
})

describe.concurrent("AttrSelectors.selectHasMaxxed", () => {
  it.each([6, 5])("does not count Essence at %i or inactive attributes toward the maximum", (essence) => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (sheet) => {
        sheet.attributes[AttributeKey.essence] = essence
        sheet.attributes[AttributeKey.body] = 5
        sheet.attributes[AttributeKey.logic] = 5
      },
    })

    // Act
    const hasMaxxedAttribute = AttrSelectors.selectHasMaxxed(stateFor(runner))

    // Assert
    expect(hasMaxxedAttribute).toBe(false)
  })

  it.each([AttributeKey.body, AttributeKey.logic])("counts %s at its natural maximum", (attribute) => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (sheet) => {
        sheet.attributes[AttributeKey.essence] = 5
        sheet.attributes[attribute] = 6
      },
    })

    // Act
    const hasMaxxedAttribute = AttrSelectors.selectHasMaxxed(stateFor(runner))

    // Assert
    expect(hasMaxxedAttribute).toBe(true)
  })

  it("does not count an AI's computed Matrix attributes at their maximum", () => {
    // Arrange
    const runner = aiRunnerFor(
      { charisma: 4, intuition: 4, logic: 4, willpower: 4 },
      knownNodeFixture({ [AttributeKey.response]: 6, [AttributeKey.signal]: 6 }),
    )

    // Act
    const hasMaxxedAttribute = AttrSelectors.selectHasMaxxed(stateFor(runner))

    // Assert
    expect(hasMaxxedAttribute).toBe(false)
  })
})

describe("AttrSelectors.selectValue — AI metatype", () => {
  it("computes System and Firewall from the AI's own Mental attributes", () => {
    // Arrange: RAW's own worked example (Unwired p.167) — CHA 2, INT 5, LOG 4, WIL 3 gives
    // System = ceil(avg(INT, LOG)) = 5, Firewall = ceil(avg(WIL, CHA)) = 3.
    const runner = aiRunnerFor(corvusMentalAttrs)

    // Act / Assert
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.system })).toBe(5)
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.firewall })).toBe(3)
  })

  it("resolves Response/Signal from the Runner's Active Node", () => {
    // Arrange
    const node = knownNodeFixture({ [AttributeKey.response]: 4, [AttributeKey.signal]: 6 })
    const runner = aiRunnerFor(corvusMentalAttrs, node)

    // Act / Assert
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.response })).toBe(4)
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.signal })).toBe(6)
  })

  it("falls back to 0 for Response/Signal with no Active Node", () => {
    // Arrange
    const runner = aiRunnerFor(corvusMentalAttrs)

    // Act / Assert
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.response })).toBe(0)
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.signal })).toBe(0)
  })
})

describe("AttrSelectors.selectRawValue — Essence spent on implants", () => {
  const magicianWithImplants = (implants: Pick<ImplantData, "state" | "essenceCost">[]) => runnerDataFactory({
    items: createItemMap(implants.flatMap((implant) => createItem<ImplantData>({
      name: "Cybereyes",
      itemType: ItemType.implant,
      implantType: ImplantType.cyberware,
      ...implant,
    }))),
    afterBuild: (s) => {
      s.biology.awakening = AwakeningType.Magician
      s.attributes[AttributeKey.essence] = 6
      s.attributes[AttributeKey.magic] = 5
    },
  })

  it("reduces Essence and Magic by the rounded-up Essence cost of Implanted implants", () => {
    // Arrange
    const runner = magicianWithImplants([{ state: ItemState.implanted, essenceCost: 1.2 }])

    // Act
    const essence = AttrSelectors.selectRawValue(stateFor(runner), { attr: AttributeKey.essence })
    const magic = AttrSelectors.selectRawValue(stateFor(runner), { attr: AttributeKey.magic })

    // Assert
    expect(essence).toBe(4)
    expect(magic).toBe(3)
  })

  it("ignores implants that aren't Implanted", () => {
    // Arrange
    const runner = magicianWithImplants([
      { state: ItemState.available, essenceCost: 1 },
      { state: ItemState.stashed, essenceCost: 1 },
    ])

    // Act
    const essence = AttrSelectors.selectRawValue(stateFor(runner), { attr: AttributeKey.essence })
    const magic = AttrSelectors.selectRawValue(stateFor(runner), { attr: AttributeKey.magic })

    // Assert
    expect(essence).toBe(6)
    expect(magic).toBe(5)
  })

  it("never reduces Magic below 0", () => {
    // Arrange
    const runner = magicianWithImplants([{ state: ItemState.implanted, essenceCost: 5.5 }])

    // Act
    const magic = AttrSelectors.selectRawValue(stateFor(runner), { attr: AttributeKey.magic })

    // Assert
    expect(magic).toBe(0)
  })

  it("leaves the stored base values unchanged", () => {
    // Arrange
    const runner = magicianWithImplants([{ state: ItemState.implanted, essenceCost: 2 }])

    // Act
    const magicBase = AttrSelectors.selectBase(stateFor(runner), { key: AttributeKey.magic })

    // Assert
    expect(magicBase).toBe(5)
  })
})

describe("AttrSelectors.selectRatingBreakdown", () => {
  const ratingStateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

  it("adds active attrMod GameEffects to the raw value, named after their source", () => {
    // Arrange
    const [implant] = createItem({
      name: "Muscle Toner",
      itemType: ItemType.implant,
      state: ItemState.implanted,
      effects: [{ type: GameEffectType.attrMod, target: AttributeKey.agility, value: 2 }],
    })
    const runner = runnerDataFactory({
      items: createItemMap([implant]),
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 4
      },
    })

    // Act
    const breakdown = AttrSelectors.selectRatingBreakdown(ratingStateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(breakdown).toEqual({ rawValue: 4, modifiers: [{ name: "Muscle Toner", value: 2 }], rating: 6 })
  })

  it("adds an Adept Power's attrMod GameEffects, named after the Power", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.reaction] = 3
        s.powers = [improvedReflexes(1)]
      },
    })

    // Act
    const breakdown = AttrSelectors.selectRatingBreakdown(ratingStateFor(runner), { attr: AttributeKey.reaction })

    // Assert
    expect(breakdown).toEqual({ rawValue: 3, modifiers: [{ name: "Improved Reflexes", value: 1 }], rating: 4 })
  })

  it("adds a Spell's attrMod GameEffects while it is sustained on its caster", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 4
        s.spells = [increaseAgility({ sustained: true })]
      },
    })

    // Act
    const breakdown = AttrSelectors.selectRatingBreakdown(ratingStateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(breakdown).toEqual({ rawValue: 4, modifiers: [{ name: "Increase Agility", value: 2 }], rating: 6 })
  })

  it.each([
    { case: "isn't sustained", sustained: false, sustainedOn: undefined },
    { case: "is sustained on someone else", sustained: true, sustainedOn: SpellSustainTarget.Other },
  ])("ignores the attrMod GameEffects of a sustainable Spell that $case", ({ sustained, sustainedOn }) => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 4
        s.spells = [increaseAgility({ sustained, sustainedOn })]
      },
    })

    // Act
    const breakdown = AttrSelectors.selectRatingBreakdown(ratingStateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(breakdown).toEqual({ rawValue: 4, modifiers: [], rating: 4 })
  })

  it("caps the rating at the metatype's augmented maximum", () => {
    // Arrange
    const [implant] = createItem({
      name: "Muscle Toner",
      itemType: ItemType.implant,
      state: ItemState.implanted,
      effects: [{ type: GameEffectType.attrMod, target: AttributeKey.agility, value: 6 }],
    })
    const runner = runnerDataFactory({
      items: createItemMap([implant]),
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 6
      },
    })
    const augmentedMax = AttrSelectors.selectBounds(ratingStateFor(runner))[AttributeKey.agility]!.augMax!

    // Act
    const rating = AttrSelectors.selectRating(ratingStateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(rating).toBe(augmentedMax)
  })

  it("ignores the Runner's GameEffects when another entity is in scope", () => {
    // Arrange
    const [implant] = createItem({
      name: "Muscle Toner",
      itemType: ItemType.implant,
      state: ItemState.implanted,
      effects: [{ type: GameEffectType.attrMod, target: AttributeKey.agility, value: 2 }],
    })
    const runner = runnerDataFactory({ items: createItemMap([implant]) })
    const otherEntity = { kind: EntityKind.item, attributes: { [AttributeKey.agility]: 3 } }

    // Act
    const breakdown = AttrSelectors.selectRatingBreakdown(
      { runner, entity: otherEntity, items: getItemCatalog(runner) },
      { attr: AttributeKey.agility },
    )

    // Assert
    expect(breakdown).toEqual({ rawValue: 3, modifiers: [], rating: 3 })
  })
})

describe("AttrSelectors.selectAllRatings", () => {
  it("returns every attribute's rating, including Adept Power modifiers", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.reaction] = 3
        s.attributes[AttributeKey.agility] = 4
        s.powers = [improvedReflexes(2)]
      },
    })

    // Act
    const ratings = AttrSelectors.selectAllRatings(stateFor(runner))

    // Assert
    expect(ratings[AttributeKey.reaction]).toBe(5)
    expect(ratings[AttributeKey.agility]).toBe(4)
  })

  it("returns the same reference for a freshly assembled scope over the same Runner", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.powers = [improvedReflexes(1)]
      },
    })

    // Act
    const first = AttrSelectors.selectAllRatings(stateFor(runner))
    const second = AttrSelectors.selectAllRatings(stateFor(runner))

    // Assert
    expect(second).toBe(first)
  })
})

describe("AttrSelectors.selectRatingBreakdown with Encumbrance", () => {
  const ratingStateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })
  const heavyArmorRunner = () => {
    const [armor] = createItem<ArmorData>({
      name: "Heavy Armor",
      itemType: ItemType.armor,
      state: ItemState.equipped,
      ballistic: 10,
      impact: 6,
    })
    return runnerDataFactory({
      items: createItemMap([armor]),
      afterBuild: (s) => {
        s.attributes[AttributeKey.body] = 3
        s.attributes[AttributeKey.agility] = 5
        s.attributes[AttributeKey.strength] = 4
      },
    })
  }

  it("applies the Encumbrance penalty to Agility", () => {
    // Arrange
    const runner = heavyArmorRunner()

    // Act
    const breakdown = AttrSelectors.selectRatingBreakdown(ratingStateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(breakdown).toEqual({ rawValue: 5, modifiers: [{ name: "Encumbrance", value: -2 }], rating: 3 })
  })

  it("leaves attributes other than Agility and Reaction alone", () => {
    // Arrange
    const runner = heavyArmorRunner()

    // Act
    const breakdown = AttrSelectors.selectRatingBreakdown(ratingStateFor(runner), { attr: AttributeKey.strength })

    // Assert
    expect(breakdown).toEqual({ rawValue: 4, modifiers: [], rating: 4 })
  })
})

/** Dice Group selectors read `{ runner, entity, items }` — what `useRunnerSelector` assembles from a `RunnerData`. */
const diceGroupStateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

describe("AttrSelectors.DiceGroups.selectAttr", () => {
  it("returns just the base Attribute rating", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.agility] = 4
    } })

    // Act
    const groups = AttrSelectors.DiceGroups.selectAttr(diceGroupStateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(groups).toEqual([{ name: "AGI", size: 4, type: "attribute" }])
  })

  it("includes active attrMod GameEffects in the size and lists them as modifiers", () => {
    // Arrange
    const [implant] = createItem({
      name: "Muscle Augmentation",
      itemType: ItemType.implant,
      state: ItemState.implanted,
      effects: [{ type: GameEffectType.attrMod, target: AttributeKey.agility, value: 2 }],
    })
    const runner = runnerDataFactory({
      items: createItemMap([implant]),
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 4
      },
    })

    // Act
    const groups = AttrSelectors.DiceGroups.selectAttr(diceGroupStateFor(runner), { attr: AttributeKey.agility })

    // Assert
    expect(groups).toEqual([{
      name: "AGI",
      size: 6,
      type: "attribute",
      breakdown: { rawValue: 4, modifiers: [{ name: "Muscle Augmentation", value: 2 }], rating: 6 },
    }])
  })

  it("returns the same reference for equal options passed as a new object", () => {
    // Arrange
    const state = diceGroupStateFor(runnerDataFactory())

    // Act
    const first = AttrSelectors.DiceGroups.selectAttr(state, { attr: AttributeKey.charisma })
    const second = AttrSelectors.DiceGroups.selectAttr(state, { attr: AttributeKey.charisma })

    // Assert
    expect(second).toBe(first)
  })
})

describe("AttrSelectors.DiceGroups.selectAttr with Encumbrance", () => {
  it("lists Encumbrance as a modifier on Reaction, already counted in its size", () => {
    // Arrange
    const [armor] = createItem<ArmorData>({
      name: "Heavy Armor",
      itemType: ItemType.armor,
      state: ItemState.equipped,
      ballistic: 10,
      impact: 6,
    })
    const runner = runnerDataFactory({
      items: createItemMap([armor]),
      afterBuild: (s) => {
        s.attributes[AttributeKey.body] = 3
        s.attributes[AttributeKey.reaction] = 4
      },
    })

    // Act
    const groups = AttrSelectors.DiceGroups.selectAttr(diceGroupStateFor(runner), { attr: AttributeKey.reaction })

    // Assert
    expect(groups).toEqual([{
      name: "REA",
      size: 2,
      type: "attribute",
      breakdown: { rawValue: 4, modifiers: [{ name: "Encumbrance", value: -2 }], rating: 2 },
    }])
  })
})
