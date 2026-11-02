import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { spiritTypeMatchesSpecialization } from "#/system/formulas/magic/spiritSpecialization.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SpiritType } from "#/system/model/magic/spiritData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const selectMagicGroups = injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.magic })
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
  /** The Spellcasting test: Magic + Spellcasting. */
  export const selectSpellcastingTest = createDicePoolSelector({
    id: "magic.spellcasting",
    label: "Spellcasting",
    groups: [
      selectMagicGroups,
      injectOption(SkillsSelectors.DiceGroups.selectSkill, { skill: SkillKey.spellcasting, excludeDefaulting: false }),
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
   * Specialization bonus when it covers that spirit type. The caller names it Summoning or Binding.
   */
  export const selectSummoningTest = createDicePoolSelector({
    id: "magic.summoning",
    label: "Summoning",
    groups: [selectMagicGroups, SkillsSelectors.DiceGroups.selectSkill, selectSpiritSpecializationGroups],
  })
}
