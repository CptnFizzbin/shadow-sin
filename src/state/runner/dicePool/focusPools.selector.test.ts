import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { createItemMap } from "#/system/model/items/itemData.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import { MagicalType } from "#/system/model/items/magicalData.ts"
import { FocusType } from "#/system/model/magic/focusData.ts"
import { SpellCategory } from "#/system/model/magic/spellData.ts"
import { SpiritType } from "#/system/model/magic/spiritData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { CombatPoolSelectors } from "./combatPools.selector.ts"
import { MagicPoolSelectors } from "./magicPools.selector.ts"

const makeFocus = (overrides: Partial<FocusData> = {}): FocusData => ({
  kind: EntityKind.item,
  id: crypto.randomUUID() as UUID,
  name: "Focus",
  itemType: ItemType.magical,
  magicalType: MagicalType.focus,
  focusType: FocusType.Power,
  force: 2,
  bonded: true,
  state: ItemState.equipped,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

const stateWith = (...items: ItemData[]) => {
  const runner = runnerDataFactory({ items: createItemMap(items) })
  return { runner, entity: runner, items: getItemCatalog(runner) }
}

const focusGroup = (name: string, size: number) => ({ name, size, type: "bonus" })

describe.concurrent("focus bonuses in dice pools", () => {
  it("add a Spellcasting Focus's Force when casting a spell of its category only", () => {
    // Arrange
    const focus = makeFocus({ name: "Combat Focus", focusType: FocusType.Spellcasting, force: 3, spellCategory: SpellCategory.Combat })
    const state = stateWith(focus)

    // Act
    const combatPool = MagicPoolSelectors.selectSpellcastingTest(state, { spellCategory: SpellCategory.Combat })
    const healthPool = MagicPoolSelectors.selectSpellcastingTest(state, { spellCategory: SpellCategory.Health })

    // Assert
    expect(combatPool.groups).toContainEqual(focusGroup("Combat Focus", 3))
    expect(healthPool.groups).not.toContainEqual(focusGroup("Combat Focus", 3))
  })

  it("add nothing from a Focus that is Bonded but not Equipped, or Equipped but not Bonded", () => {
    // Arrange
    const unequipped = makeFocus({ name: "Unequipped", state: ItemState.available })
    const unbonded = makeFocus({ name: "Unbonded", bonded: false })
    const state = stateWith(unequipped, unbonded)

    // Act
    const pool = MagicPoolSelectors.selectSpellcastingTest(state, { spellCategory: SpellCategory.Combat })

    // Assert
    expect(pool.groups.map((group) => group.name)).not.toContain("Unequipped")
    expect(pool.groups.map((group) => group.name)).not.toContain("Unbonded")
  })

  it("add a Summoning Focus's Force to summoning, but not binding, its spirit type", () => {
    // Arrange
    const focus = makeFocus({ name: "Fire Focus", focusType: FocusType.Summoning, force: 2, spiritType: SpiritType.fire })
    const state = stateWith(focus)

    // Act
    const summonFire = MagicPoolSelectors.selectSummoningTest(state, { skill: SkillKey.summoning, spiritType: SpiritType.fire })
    const summonWater = MagicPoolSelectors.selectSummoningTest(state, { skill: SkillKey.summoning, spiritType: SpiritType.water })
    const bindFire = MagicPoolSelectors.selectSummoningTest(state, { skill: SkillKey.binding, spiritType: SpiritType.fire })

    // Assert
    expect(summonFire.groups).toContainEqual(focusGroup("Fire Focus", 2))
    expect(summonWater.groups).not.toContainEqual(focusGroup("Fire Focus", 2))
    expect(bindFire.groups).not.toContainEqual(focusGroup("Fire Focus", 2))
  })

  it("add a Power Focus's Force to tests that roll Magic, but not to Drain Resistance", () => {
    // Arrange
    const focus = makeFocus({ name: "Power Focus", focusType: FocusType.Power, force: 2 })
    const state = stateWith(focus)

    // Act
    const spellcasting = MagicPoolSelectors.selectSpellcastingTest(state, { spellCategory: SpellCategory.Detection })
    const drain = MagicPoolSelectors.selectDrainResistanceTest(state, { attr: AttributeKey.logic })

    // Assert
    expect(spellcasting.groups).toContainEqual(focusGroup("Power Focus", 2))
    expect(drain.groups).not.toContainEqual(focusGroup("Power Focus", 2))
  })

  it("add a Counterspelling Focus for combat spells to combat spell defense", () => {
    // Arrange
    const focus = makeFocus({ name: "Shield Focus", focusType: FocusType.Counterspelling, force: 1, spellCategory: SpellCategory.Combat })
    const state = stateWith(focus)

    // Act
    const pool = CombatPoolSelectors.selectManaSpellDefenseTest(state)

    // Assert
    expect(pool.groups).toContainEqual(focusGroup("Shield Focus", 1))
  })

  it("add a Weapon Focus's Force to attacks with the weapon it's attached to only", () => {
    // Arrange
    const weaponId = crypto.randomUUID() as UUID
    const otherWeaponId = crypto.randomUUID() as UUID
    const focus = makeFocus({ name: "Sword Focus", focusType: FocusType.Weapon, force: 3, items: { parentId: weaponId, childIds: [] } })
    const state = stateWith(focus)
    const attack = { attr: AttributeKey.agility, skill: SkillKey.blades, extraGroups: [] }

    // Act
    const withLinkedWeapon = CombatPoolSelectors.selectAttackTest(state, { ...attack, weaponId })
    const withOtherWeapon = CombatPoolSelectors.selectAttackTest(state, { ...attack, weaponId: otherWeaponId })

    // Assert
    expect(withLinkedWeapon.groups).toContainEqual(focusGroup("Sword Focus", 3))
    expect(withOtherWeapon.groups).not.toContainEqual(focusGroup("Sword Focus", 3))
  })
})
