import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { DicePoolId } from "#/data/gameEffects/dicePoolId.ts"
import type { SpellCategory } from "#/data/magic/spellData.ts"
import type { SpiritType } from "#/data/magic/spiritData.ts"
import { SkillKey } from "#/data/skills/skillKey.ts"
import { aidDiceGroups } from "#/rules/dicePool/aidDiceGroups.ts"
import type { DiceGroup } from "#/rules/dicePool/diceGroup.tsx"
import { spiritTypeMatchesSpecialization } from "#/rules/magic/spiritSpecialization.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { createMemoizedSelector, injectOption } from "#/state/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { DicePoolModSelectors } from "#/state/runner/gameEffects/dicePoolMods.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

/** Magic, plus the bonus dice (e.g. from a Power Focus) every test that rolls Magic gets. */
const selectMagicGroups = createMemoizedSelector(
  injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.magic }),
  injectOption(DicePoolModSelectors.selectGroups, { poolId: DicePoolId.magicTests }),
  (magicGroups, magicTestGroups): DiceGroup[] => [...magicGroups, ...magicTestGroups],
)
const selectWillpowerGroups = injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.willpower })

/** The `skill` Specialization's bonus, but only when that Specialization covers `spiritType`. */
const selectSpiritSpecializationGroups = (
  state: EntityScope,
  { skill, spiritType }: { skill: SkillKey, spiritType: SpiritType },
): DiceGroup[] => {
  const specialization = SkillsSelectors.selectSpecialization(state, { skillName: skill })
  const applies = !!specialization && spiritTypeMatchesSpecialization(spiritType, specialization)
  return SkillsSelectors.DiceGroups.selectSpecialization(state, { skill, specialization: applies ? specialization : undefined })
}

/** The Spellcasting Specialization's bonus, when it covers `spellCategory` (e.g. "Combat Spells"). */
const selectSpellcastingSpecializationGroups = (
  state: EntityScope,
  { spellCategory }: { spellCategory?: SpellCategory },
): DiceGroup[] =>
  SkillsSelectors.DiceGroups.selectSpecializationCovering(state, { skill: SkillKey.spellcasting, poolSubTarget: spellCategory })

/** Bonus dice (e.g. from a Spellcasting Focus) for casting a spell of `spellCategory`. */
const selectSpellcastingModGroups = (
  state: EntityScope,
  { spellCategory }: { spellCategory?: SpellCategory },
): DiceGroup[] =>
  DicePoolModSelectors.selectGroups(state, { poolId: DicePoolId.spellcasting, poolSubTarget: spellCategory })

/** Bonus dice (e.g. from a Summoning or Binding Focus) for summoning or binding with `skill` against `spiritType`. */
const selectSpiritModGroups = (
  state: EntityScope,
  { skill, spiritType }: { skill: SkillKey, spiritType: SpiritType },
): DiceGroup[] =>
  DicePoolModSelectors.selectGroups(state, {
    poolId: skill === SkillKey.binding ? DicePoolId.binding : DicePoolId.summoning,
    poolSubTarget: spiritType,
  })

/** Dice from `aid` (e.g. a spirit's aid power), with Teamwork limited by the caster's Spellcasting Rating. */
const selectSpellcastingAidGroups = createMemoizedSelector(
  SelectorOptions.aid,
  injectOption(SkillsSelectors.selectRating, { skill: SkillKey.spellcasting }),
  aidDiceGroups,
)

/** The tradition's drain `attr`, renamed when it's Willpower so its row isn't confused with the first Willpower. */
const selectDrainAttrGroups = createMemoizedSelector(
  AttrSelectors.DiceGroups.selectAttr,
  (_state: EntityScope, { attr }: { attr: AttributeKey }) => attr,
  (drainAttrGroups, attr): DiceGroup[] =>
    attr === AttributeKey.willpower
      ? drainAttrGroups.map((group) => ({ ...group, name: `${group.name} (Drain)` }))
      : drainAttrGroups,
)

export namespace MagicPoolSelectors {
  /**
   * The Spellcasting test: Magic + Spellcasting, plus the Specialization and other bonuses (e.g. a
   * focus) for casting a spell of `spellCategory`, and any `aid` from assistants or spirits.
   */
  export const selectSpellcastingTest = createDicePoolSelector({
    id: "magic.spellcasting",
    label: "Spellcasting",
    groups: [
      selectMagicGroups,
      injectOption(SkillsSelectors.DiceGroups.selectSkill, { skill: SkillKey.spellcasting, excludeDefaulting: false }),
      selectSpellcastingSpecializationGroups,
      selectSpellcastingModGroups,
      selectSpellcastingAidGroups,
    ],
  })

  /** The Drain Resistance test: Willpower + the tradition's drain `attr`. */
  export const selectDrainResistanceTest = createDicePoolSelector({
    id: "magic.drainResistance",
    label: "Drain Resistance",
    groups: [selectWillpowerGroups, selectDrainAttrGroups],
    // A Resistance Test never takes the Wound Modifier.
    excludeWoundMod: true,
  })

  /**
   * The Summoning or Binding test for `spiritType`: Magic + `skill`, plus the skill's
   * Specialization bonus when it covers that spirit type and any bonuses (e.g. from a focus) against
   * it. The caller names it Summoning or Binding.
   */
  export const selectSummoningTest = createDicePoolSelector({
    id: "magic.summoning",
    label: "Summoning",
    groups: [selectMagicGroups, SkillsSelectors.DiceGroups.selectSkill, selectSpiritSpecializationGroups, selectSpiritModGroups],
  })
}
