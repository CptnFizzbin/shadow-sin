import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { calculateArmorTotals } from "#/system/formulas/items/encumbranceUtils.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { ArmorRatingType } from "#/system/model/items/armorData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const NO_GROUPS: DiceGroup[] = []

const attrGroupsFor = (attr: AttributeKey) => injectOption(AttrSelectors.DiceGroups.selectAttr, { attr })

const skillGroupsFor = (skill: SkillKey) =>
  injectOption(SkillsSelectors.DiceGroups.selectSkill, { skill, excludeDefaulting: false })

const selectReactionGroups = attrGroupsFor(AttributeKey.reaction)
const selectBodyGroups = attrGroupsFor(AttributeKey.body)
const selectWillpowerGroups = attrGroupsFor(AttributeKey.willpower)
const selectDodgeGroups = skillGroupsFor(SkillKey.dodge)
const selectUnarmedCombatGroups = skillGroupsFor(SkillKey.unarmedCombat)
const selectCounterspellingGroups = skillGroupsFor(SkillKey.counterspelling)

/** Body for Physical damage, Willpower for Stun. */
const selectDamageResistanceAttrGroups = (state: EntityScope, { damageType }: { damageType: "P" | "S" }): DiceGroup[] =>
  damageType === "P" ? selectBodyGroups(state) : selectWillpowerGroups(state)

/** `skill`'s groups — twice when `doubleSkill` is set — or none when no skill is given. */
const selectDefenseSkillGroups = createMemoizedSelector(
  (state: EntityScope, { skill }: { skill?: SkillKey }) =>
    skill ? SkillsSelectors.DiceGroups.selectSkill(state, { skill }) : NO_GROUPS,
  SelectorOptions.doubleSkill,
  (skillGroups, doubleSkill): DiceGroup[] => doubleSkill ? [...skillGroups, ...skillGroups] : skillGroups,
)

/** The Runner's total `armor` rating, stacking armor modifiers, halved (rounding down) when `halveArmor` is set. */
const selectTotalArmorGroups = createMemoizedSelector(
  ItemSelectors.Armor.selectEquipped,
  SelectorOptions.armor,
  SelectorOptions.halveArmor,
  (equippedArmor, armor, halveArmor): DiceGroup[] => {
    const total = calculateArmorTotals(equippedArmor)[armor]
    const armorLabel = armor === ArmorRatingType.ballistic ? "Ballistic" : "Impact"
    return [halveArmor
      ? { name: `Armor (${armorLabel}, half)`, size: Math.floor(total / 2), color: "info.main" }
      : { name: `Armor (${armorLabel})`, size: total, color: "info.main" }]
  },
)

/**
 * Defense and damage resistance pools. Labels are fixed; a component showing a pool whose label
 * depends on its options (the damage type, the parrying skill) sets the label itself.
 */
export namespace CombatPoolSelectors {
  /** Resisting `damageType` damage (Physical with Body, Stun with Willpower) with `armor`. */
  export const selectResistDamageTest = createDicePoolSelector({
    id: "resist.damage",
    label: "Resist Damage",
    groups: [selectDamageResistanceAttrGroups, ItemSelectors.Armor.DiceGroups.selectArmor],
    // A Resistance Test never takes the Wound Modifier.
    excludeWoundMod: true,
  })

  /** Resisting a direct Mana spell: Willpower. */
  export const selectResistManaSpellTest = createDicePoolSelector({
    id: "resist.spell.mana",
    label: "Resist Mana Spell",
    groups: [selectWillpowerGroups],
    // A Resistance Test never takes the Wound Modifier.
    excludeWoundMod: true,
  })

  /** Resisting a direct Physical spell: Body. */
  export const selectResistPhysicalSpellTest = createDicePoolSelector({
    id: "resist.spell.physical",
    label: "Resist Physical Spell",
    groups: [selectBodyGroups],
    // A Resistance Test never takes the Wound Modifier.
    excludeWoundMod: true,
  })

  /** Defending against a ranged attack: Reaction. */
  export const selectRangedDefenseTest = createDicePoolSelector({
    id: "defense.ranged",
    label: "Ranged Defense",
    groups: [selectReactionGroups],
  })

  /** Full-defending against a ranged attack: Reaction + Dodge. */
  export const selectRangedFullDefenseTest = createDicePoolSelector({
    id: "defense.ranged.full",
    label: "Ranged Full Defense",
    groups: [selectReactionGroups, selectDodgeGroups],
  })

  /** Blocking a melee attack: Reaction + Unarmed Combat. */
  export const selectMeleeBlockTest = createDicePoolSelector({
    id: "defense.melee.block",
    label: "Melee Block",
    groups: [selectReactionGroups, selectUnarmedCombatGroups],
  })

  /** Dodging a melee attack: Reaction + Dodge. */
  export const selectMeleeDodgeTest = createDicePoolSelector({
    id: "defense.melee.dodge",
    label: "Melee Dodge",
    groups: [selectReactionGroups, selectDodgeGroups],
  })

  /** Full-blocking a melee attack: Reaction + Unarmed Combat + Dodge. */
  export const selectMeleeFullBlockTest = createDicePoolSelector({
    id: "defense.melee.fullBlock",
    label: "Melee Full Block",
    groups: [selectReactionGroups, selectUnarmedCombatGroups, selectDodgeGroups],
  })

  /** Full-dodging a melee attack: Reaction + Dodge, rolled twice. */
  export const selectMeleeFullDodgeTest = createDicePoolSelector({
    id: "defense.melee.fullDodge",
    label: "Melee Full Dodge",
    groups: [selectReactionGroups, selectDodgeGroups, selectDodgeGroups],
  })

  /** Parrying with the weapon `skill`: Reaction + `skill`. */
  export const selectMeleeParryTest = createDicePoolSelector({
    id: "defense.melee.parry",
    label: "Parry",
    groups: [selectReactionGroups, SkillsSelectors.DiceGroups.selectSkill],
  })

  /** Full-parrying with the weapon `skill`: Reaction + `skill` + Dodge. */
  export const selectMeleeFullParryTest = createDicePoolSelector({
    id: "defense.melee.fullParry",
    label: "Full Parry",
    groups: [selectReactionGroups, SkillsSelectors.DiceGroups.selectSkill, selectDodgeGroups],
  })

  /** Defending against a Physical spell: Body + Counterspelling. */
  export const selectPhysicalSpellDefenseTest = createDicePoolSelector({
    id: "defense.spell.physical",
    label: "Physical Spell Defense",
    groups: [selectBodyGroups, selectCounterspellingGroups],
  })

  /** Defending against a Mana spell: Willpower + Counterspelling. */
  export const selectManaSpellDefenseTest = createDicePoolSelector({
    id: "defense.spell.mana",
    label: "Mana Spell Defense",
    groups: [selectWillpowerGroups, selectCounterspellingGroups],
  })

  /**
   * The Attack test: `attr` + `skill` and the attack's situational `extraGroups`. Encumbrance
   * reaches it through the Agility or Reaction Rating.
   */
  export const selectAttackTest = createDicePoolSelector({
    id: "attack",
    label: "Attack",
    groups: [AttrSelectors.DiceGroups.selectAttr, SkillsSelectors.DiceGroups.selectSkill, SelectorOptions.extraGroups],
  })

  /**
   * The Defense Calculator's defense test: `attr` + `skill` (rolled twice when `doubleSkill` is
   * set) and the situational `extraGroups`. Encumbrance reaches it through the Reaction Rating.
   */
  export const selectDefenseCalculatorTest = createDicePoolSelector({
    id: "defense",
    label: "Defense",
    groups: [AttrSelectors.DiceGroups.selectAttr, selectDefenseSkillGroups, SelectorOptions.extraGroups],
  })

  /**
   * The Defense Calculator's damage resistance test: `attr` + the Runner's total `armor` rating,
   * halved (rounding down) when `halveArmor` is set.
   */
  export const selectDefenseCalculatorResistTest = createDicePoolSelector({
    id: "defense.resist",
    label: "Resist Damage",
    groups: [AttrSelectors.DiceGroups.selectAttr, selectTotalArmorGroups],
    // A Resistance Test never takes the Wound Modifier.
    excludeWoundMod: true,
  })
}
