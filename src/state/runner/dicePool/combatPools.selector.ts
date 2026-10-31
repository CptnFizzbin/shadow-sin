import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolConfig } from "#/components/system/dicePool/dicePoolData.tsx"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { DiceGroupSelectors } from "#/state/runner/diceGroup/diceGroup.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { calculateArmorTotals } from "#/system/formulas/items/encumbranceUtils.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { ArmorRatingType } from "#/system/model/items/armorData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const NO_GROUPS: DiceGroup[] = []

const attrTestFor = (attr: AttributeKey) => injectOption(DiceGroupSelectors.selectAttr, { attr })

const skillTestFor = (skill: SkillKey) =>
  injectOption(DiceGroupSelectors.selectSkill, { skill, excludeDefaulting: false })

const selectReactionTest = attrTestFor(AttributeKey.reaction)
const selectBodyTest = attrTestFor(AttributeKey.body)
const selectWillpowerTest = attrTestFor(AttributeKey.willpower)
const selectDodgeTest = skillTestFor(SkillKey.dodge)
const selectUnarmedCombatTest = skillTestFor(SkillKey.unarmedCombat)
const selectCounterspellingTest = skillTestFor(SkillKey.counterspelling)

/** `skill`'s groups, or none when no skill is given. */
const selectOptionalSkillTest = (state: EntityScope, { skill }: { skill?: SkillKey }): DiceGroup[] =>
  skill ? DiceGroupSelectors.selectSkill(state, { skill }) : NO_GROUPS

/** The total ballistic/impact rating of the Runner's equipped armor, stacking armor modifiers. */
const selectArmorTotals = createMemoizedSelector(
  ItemSelectors.Armor.selectEquipped,
  (equippedArmor) => calculateArmorTotals(equippedArmor),
)

export namespace CombatPoolSelectors {
  /** Resisting `damageType` damage (Physical with Body, Stun with Willpower) with `armor`. */
  export const selectResistDamageTest = createDicePoolSelector(
    selectBodyTest,
    selectWillpowerTest,
    DiceGroupSelectors.selectArmor,
    SelectorOptions.damageResistanceType,
    SelectorOptions.armor,
    (bodyGroups, willpowerGroups, armorGroups, damageType, armor): DicePoolConfig => ({
      id: `resist.damage.${armor}.${damageType}`,
      // A Resistance Test never takes the Wound Modifier.
      excludeWoundMod: true,
      label: `Resist ${armor} (${damageType})`,
      groups: [...(damageType === "P" ? bodyGroups : willpowerGroups), ...armorGroups],
    }),
  )

  /** Resisting a direct Mana spell: Willpower. */
  export const selectResistManaSpellTest = createDicePoolSelector(
    selectWillpowerTest,
    (willpowerGroups): DicePoolConfig => ({
      id: "resist.spell.mana",
      // A Resistance Test never takes the Wound Modifier.
      excludeWoundMod: true,
      label: "Resist Mana Spell",
      groups: willpowerGroups,
    }),
  )

  /** Resisting a direct Physical spell: Body. */
  export const selectResistPhysicalSpellTest = createDicePoolSelector(
    selectBodyTest,
    (bodyGroups): DicePoolConfig => ({
      id: "resist.spell.physical",
      // A Resistance Test never takes the Wound Modifier.
      excludeWoundMod: true,
      label: "Resist Physical Spell",
      groups: bodyGroups,
    }),
  )

  /** Defending against a ranged attack: Reaction. */
  export const selectRangedDefenseTest = createDicePoolSelector(
    selectReactionTest,
    (reactionGroups): DicePoolConfig => ({
      id: "defense.ranged",
      label: "Ranged Defense",
      groups: [...reactionGroups],
    }),
  )

  /** Full-defending against a ranged attack: Reaction + Dodge. */
  export const selectRangedFullDefenseTest = createDicePoolSelector(
    selectReactionTest,
    selectDodgeTest,
    (reactionGroups, dodgeGroups): DicePoolConfig => ({
      id: "defense.ranged.full",
      label: "Ranged Full Defense",
      groups: [...reactionGroups, ...dodgeGroups],
    }),
  )

  /** Blocking a melee attack: Reaction + Unarmed Combat. */
  export const selectMeleeBlockTest = createDicePoolSelector(
    selectReactionTest,
    selectUnarmedCombatTest,
    (reactionGroups, unarmedCombatGroups): DicePoolConfig => ({
      id: "defense.melee.block",
      label: "Melee Block",
      groups: [...reactionGroups, ...unarmedCombatGroups],
    }),
  )

  /** Dodging a melee attack: Reaction + Dodge. */
  export const selectMeleeDodgeTest = createDicePoolSelector(
    selectReactionTest,
    selectDodgeTest,
    (reactionGroups, dodgeGroups): DicePoolConfig => ({
      id: "defense.melee.dodge",
      label: "Melee Dodge",
      groups: [...reactionGroups, ...dodgeGroups],
    }),
  )

  /** Full-blocking a melee attack: Reaction + Unarmed Combat + Dodge. */
  export const selectMeleeFullBlockTest = createDicePoolSelector(
    selectReactionTest,
    selectUnarmedCombatTest,
    selectDodgeTest,
    (reactionGroups, unarmedCombatGroups, dodgeGroups): DicePoolConfig => ({
      id: "defense.melee.fullBlock",
      label: "Melee Full Block",
      groups: [...reactionGroups, ...unarmedCombatGroups, ...dodgeGroups],
    }),
  )

  /** Full-dodging a melee attack: Reaction + Dodge, rolled twice. */
  export const selectMeleeFullDodgeTest = createDicePoolSelector(
    selectReactionTest,
    selectDodgeTest,
    selectDodgeTest,
    (reactionGroups, dodgeGroups, dodgeGroups2): DicePoolConfig => ({
      id: "defense.melee.fullDodge",
      label: "Melee Full Dodge",
      groups: [...reactionGroups, ...dodgeGroups, ...dodgeGroups2],
    }),
  )

  /** Parrying with the weapon `skill`: Reaction + `skill`. */
  export const selectMeleeParryTest = createDicePoolSelector(
    selectReactionTest,
    DiceGroupSelectors.selectSkill,
    SelectorOptions.skill,
    (reactionGroups, weaponSkillGroups, skill): DicePoolConfig => ({
      id: `defense.melee.parry.${skill}`,
      label: `${skill} Parry`,
      groups: [...reactionGroups, ...weaponSkillGroups],
    }),
  )

  /** Full-parrying with the weapon `skill`: Reaction + `skill` + Dodge. */
  export const selectMeleeFullParryTest = createDicePoolSelector(
    selectReactionTest,
    DiceGroupSelectors.selectSkill,
    selectDodgeTest,
    SelectorOptions.skill,
    (reactionGroups, weaponSkillGroups, dodgeGroups, skill): DicePoolConfig => ({
      id: `defense.melee.fullParry.${skill}`,
      label: `${skill} Full Parry`,
      groups: [...reactionGroups, ...weaponSkillGroups, ...dodgeGroups],
    }),
  )

  /** Defending against a Physical spell: Body + Counterspelling. */
  export const selectPhysicalSpellDefenseTest = createDicePoolSelector(
    selectBodyTest,
    selectCounterspellingTest,
    (bodyGroups, counterspellingGroups): DicePoolConfig => ({
      id: "defense.spell.physical",
      label: "Physical Spell Defense",
      groups: [...bodyGroups, ...counterspellingGroups],
    }),
  )

  /** Defending against a Mana spell: Willpower + Counterspelling. */
  export const selectManaSpellDefenseTest = createDicePoolSelector(
    selectWillpowerTest,
    selectCounterspellingTest,
    (willpowerGroups, counterspellingGroups): DicePoolConfig => ({
      id: "defense.spell.mana",
      label: "Mana Spell Defense",
      groups: [...willpowerGroups, ...counterspellingGroups],
    }),
  )

  /**
   * The Attack test: `attr` + `skill` and the attack's situational `extraGroups`. Encumbrance
   * reaches it through the Agility or Reaction Rating.
   */
  export const selectAttackTest = createDicePoolSelector(
    DiceGroupSelectors.selectAttr,
    DiceGroupSelectors.selectSkill,
    SelectorOptions.extraGroups,
    (attrGroups, skillGroups, extraGroups): DicePoolConfig => ({
      id: "attack",
      label: "Attack",
      groups: [...attrGroups, ...skillGroups, ...extraGroups],
    }),
  )

  /**
   * The Defense Calculator's defense test: `attr` + `skill` (rolled twice when `doubleSkill` is
   * set) and the situational `extraGroups`. Encumbrance reaches it through the Reaction Rating.
   */
  export const selectDefenseCalculatorTest = createDicePoolSelector(
    DiceGroupSelectors.selectAttr,
    selectOptionalSkillTest,
    SelectorOptions.doubleSkill,
    SelectorOptions.extraGroups,
    (attrGroups, skillGroups, doubleSkill, extraGroups): DicePoolConfig => ({
      id: "defense",
      label: "Defense",
      groups: [
        ...attrGroups,
        ...skillGroups,
        ...(doubleSkill ? skillGroups : []),
        ...extraGroups,
      ],
    }),
  )

  /**
   * The Defense Calculator's damage resistance test: `attr` + the Runner's total `armor` rating,
   * halved (rounding down) when `halveArmor` is set.
   */
  export const selectDefenseCalculatorResistTest = createDicePoolSelector(
    DiceGroupSelectors.selectAttr,
    selectArmorTotals,
    SelectorOptions.armor,
    SelectorOptions.halveArmor,
    (attrGroups, armorTotals, armor, halveArmor): DicePoolConfig => {
      const armorLabel = armor === ArmorRatingType.ballistic ? "Ballistic" : "Impact"

      return {
        id: "defense.resist",
        // A Resistance Test never takes the Wound Modifier.
        excludeWoundMod: true,
        label: "Resist Damage",
        groups: [
          ...attrGroups,
          halveArmor
            ? { name: `Armor (${armorLabel}, half)`, size: Math.floor(armorTotals[armor] / 2), color: "info.main" }
            : { name: `Armor (${armorLabel})`, size: armorTotals[armor], color: "info.main" },
        ],
      }
    },
  )
}
