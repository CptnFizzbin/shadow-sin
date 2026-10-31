import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolConfig } from "#/components/system/dicePool/dicePoolData.tsx"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { calculateArmorTotals } from "#/system/formulas/items/encumbranceUtils.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { ArmorRatingType } from "#/system/model/items/armorData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"
import { DicePoolSelectors } from "./dicePool.selector.ts"

const NO_GROUPS: DiceGroup[] = []

const attrTestFor = (attr: AttributeKey) => injectOption(DicePoolSelectors.selectAttrTest, { attr })

const skillTestFor = (skill: SkillKey) =>
  injectOption(DicePoolSelectors.selectSkillTest, { skill, isSpecialized: false, excludeDefaulting: false })

const selectReactionTest = attrTestFor(AttributeKey.reaction)
const selectBodyTest = attrTestFor(AttributeKey.body)
const selectWillpowerTest = attrTestFor(AttributeKey.willpower)
const selectDodgeTest = skillTestFor(SkillKey.dodge)
const selectUnarmedCombatTest = skillTestFor(SkillKey.unarmedCombat)
const selectCounterspellingTest = skillTestFor(SkillKey.counterspelling)

/** `skill`'s groups, or none when no skill is given. */
const selectOptionalSkillTest = (state: EntityScope, { skill }: { skill?: SkillKey }): DiceGroup[] =>
  skill ? DicePoolSelectors.selectSkillTest(state, { skill }) : NO_GROUPS

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
    DicePoolSelectors.selectArmorTest,
    SelectorOptions.damageResistanceType,
    SelectorOptions.armor,
    (bodyGroups, willpowerGroups, armorGroups, damageType, armor): DicePoolConfig => ({
      id: `resist.damage.${armor}.${damageType}`,
      label: `Resist ${armor} (${damageType})`,
      groups: [...(damageType === "P" ? bodyGroups : willpowerGroups), ...armorGroups],
    }),
  )

  /** Resisting a direct Mana spell: Willpower. */
  export const selectResistManaSpellTest = createDicePoolSelector(
    selectWillpowerTest,
    (willpowerGroups): DicePoolConfig => ({
      id: "resist.spell.mana",
      label: "Resist Mana Spell",
      groups: willpowerGroups,
    }),
  )

  /** Resisting a direct Physical spell: Body. */
  export const selectResistPhysicalSpellTest = createDicePoolSelector(
    selectBodyTest,
    (bodyGroups): DicePoolConfig => ({
      id: "resist.spell.physical",
      label: "Resist Physical Spell",
      groups: bodyGroups,
    }),
  )

  /** Defending against a ranged attack: Reaction. */
  export const selectRangedDefenseTest = createDicePoolSelector(
    selectReactionTest,
    DicePoolSelectors.selectEncumbranceTest,
    (reactionGroups, encumbranceGroups): DicePoolConfig => ({
      id: "defense.ranged",
      label: "Ranged Defense",
      groups: [...reactionGroups, ...encumbranceGroups],
    }),
  )

  /** Full-defending against a ranged attack: Reaction + Dodge. */
  export const selectRangedFullDefenseTest = createDicePoolSelector(
    selectReactionTest,
    selectDodgeTest,
    DicePoolSelectors.selectEncumbranceTest,
    (reactionGroups, dodgeGroups, encumbranceGroups): DicePoolConfig => ({
      id: "defense.ranged.full",
      label: "Ranged Full Defense",
      groups: [...reactionGroups, ...dodgeGroups, ...encumbranceGroups],
    }),
  )

  /** Blocking a melee attack: Reaction + Unarmed Combat. */
  export const selectMeleeBlockTest = createDicePoolSelector(
    selectReactionTest,
    selectUnarmedCombatTest,
    DicePoolSelectors.selectEncumbranceTest,
    (reactionGroups, unarmedCombatGroups, encumbranceGroups): DicePoolConfig => ({
      id: "defense.melee.block",
      label: "Melee Block",
      groups: [...reactionGroups, ...unarmedCombatGroups, ...encumbranceGroups],
    }),
  )

  /** Dodging a melee attack: Reaction + Dodge. */
  export const selectMeleeDodgeTest = createDicePoolSelector(
    selectReactionTest,
    selectDodgeTest,
    DicePoolSelectors.selectEncumbranceTest,
    (reactionGroups, dodgeGroups, encumbranceGroups): DicePoolConfig => ({
      id: "defense.melee.dodge",
      label: "Melee Dodge",
      groups: [...reactionGroups, ...dodgeGroups, ...encumbranceGroups],
    }),
  )

  /** Full-blocking a melee attack: Reaction + Unarmed Combat + Dodge. */
  export const selectMeleeFullBlockTest = createDicePoolSelector(
    selectReactionTest,
    selectUnarmedCombatTest,
    selectDodgeTest,
    DicePoolSelectors.selectEncumbranceTest,
    (reactionGroups, unarmedCombatGroups, dodgeGroups, encumbranceGroups): DicePoolConfig => ({
      id: "defense.melee.fullBlock",
      label: "Melee Full Block",
      groups: [...reactionGroups, ...unarmedCombatGroups, ...dodgeGroups, ...encumbranceGroups],
    }),
  )

  /** Full-dodging a melee attack: Reaction + Dodge, rolled twice. */
  export const selectMeleeFullDodgeTest = createDicePoolSelector(
    selectReactionTest,
    selectDodgeTest,
    selectDodgeTest,
    DicePoolSelectors.selectEncumbranceTest,
    (reactionGroups, dodgeGroups, dodgeGroups2, encumbranceGroups): DicePoolConfig => ({
      id: "defense.melee.fullDodge",
      label: "Melee Full Dodge",
      groups: [...reactionGroups, ...dodgeGroups, ...dodgeGroups2, ...encumbranceGroups],
    }),
  )

  /** Parrying with the weapon `skill`: Reaction + `skill`. */
  export const selectMeleeParryTest = createDicePoolSelector(
    selectReactionTest,
    DicePoolSelectors.selectSkillTest,
    DicePoolSelectors.selectEncumbranceTest,
    SelectorOptions.skill,
    (reactionGroups, weaponSkillGroups, encumbranceGroups, skill): DicePoolConfig => ({
      id: `defense.melee.parry.${skill}`,
      label: `${skill} Parry`,
      groups: [...reactionGroups, ...weaponSkillGroups, ...encumbranceGroups],
    }),
  )

  /** Full-parrying with the weapon `skill`: Reaction + `skill` + Dodge. */
  export const selectMeleeFullParryTest = createDicePoolSelector(
    selectReactionTest,
    DicePoolSelectors.selectSkillTest,
    selectDodgeTest,
    DicePoolSelectors.selectEncumbranceTest,
    SelectorOptions.skill,
    (reactionGroups, weaponSkillGroups, dodgeGroups, encumbranceGroups, skill): DicePoolConfig => ({
      id: `defense.melee.fullParry.${skill}`,
      label: `${skill} Full Parry`,
      groups: [...reactionGroups, ...weaponSkillGroups, ...dodgeGroups, ...encumbranceGroups],
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
   * The Attack test: `attr` + `skill`, any encumbrance penalty when `includeEncumbrance` is set,
   * and the attack's situational `extraGroups`.
   */
  export const selectAttackTest = createDicePoolSelector(
    DicePoolSelectors.selectAttrTest,
    DicePoolSelectors.selectSkillTest,
    DicePoolSelectors.selectEncumbranceTest,
    SelectorOptions.includeEncumbrance,
    SelectorOptions.extraGroups,
    (attrGroups, skillGroups, encumbranceGroups, includeEncumbrance, extraGroups): DicePoolConfig => ({
      id: "attack",
      label: "Attack",
      groups: [...attrGroups, ...skillGroups, ...(includeEncumbrance ? encumbranceGroups : []), ...extraGroups],
    }),
  )

  /**
   * The Defense Calculator's defense test: `attr` + `skill` (rolled twice when `doubleSkill` is
   * set), any encumbrance penalty when `includeEncumbrance` is set, and the situational
   * `extraGroups`.
   */
  export const selectDefenseCalculatorTest = createDicePoolSelector(
    DicePoolSelectors.selectAttrTest,
    selectOptionalSkillTest,
    DicePoolSelectors.selectEncumbranceTest,
    SelectorOptions.doubleSkill,
    SelectorOptions.includeEncumbrance,
    SelectorOptions.extraGroups,
    (attrGroups, skillGroups, encumbranceGroups, doubleSkill, includeEncumbrance, extraGroups): DicePoolConfig => ({
      id: "defense",
      label: "Defense",
      groups: [
        ...attrGroups,
        ...skillGroups,
        ...(doubleSkill ? skillGroups : []),
        ...(includeEncumbrance ? encumbranceGroups : []),
        ...extraGroups,
      ],
    }),
  )

  /**
   * The Defense Calculator's damage resistance test: `attr` + the Runner's total `armor` rating,
   * halved (rounding down) when `halveArmor` is set.
   */
  export const selectDefenseCalculatorResistTest = createDicePoolSelector(
    DicePoolSelectors.selectAttrTest,
    selectArmorTotals,
    SelectorOptions.armor,
    SelectorOptions.halveArmor,
    (attrGroups, armorTotals, armor, halveArmor): DicePoolConfig => {
      const armorLabel = armor === ArmorRatingType.ballistic ? "Ballistic" : "Impact"

      return {
        id: "defense.resist",
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
