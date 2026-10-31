import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolConfig } from "#/components/system/dicePool/dicePoolData.tsx"
import { injectOption } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { DiceGroupSelectors } from "#/state/runner/diceGroup/diceGroup.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { spiritTypeMatchesSpecialization } from "#/system/formulas/magic/spiritSpecialization.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SpiritType } from "#/system/model/magic/spiritData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const selectMagicTest = injectOption(DiceGroupSelectors.selectAttr, { attr: AttributeKey.magic })
const selectWillpowerTest = injectOption(DiceGroupSelectors.selectAttr, { attr: AttributeKey.willpower })

/** The `skill` Specialization's bonus, but only when that Specialization covers `spiritType`. */
const selectSpiritSpecializationTest = (
  state: EntityScope,
  { skill, spiritType }: { skill: SkillKey, spiritType: SpiritType },
): DiceGroup[] => {
  const specialization = SkillsSelectors.selectSpecialization(state, { skillName: skill })
  const applies = !!specialization && spiritTypeMatchesSpecialization(spiritType, specialization)
  return DiceGroupSelectors.selectSpecialization(state, { skill, specialization: applies ? specialization : undefined })
}

export namespace MagicPoolSelectors {
  /** The Spellcasting test: Magic + Spellcasting. */
  export const selectSpellcastingTest = createDicePoolSelector(
    selectMagicTest,
    injectOption(DiceGroupSelectors.selectSkill, { skill: SkillKey.spellcasting, excludeDefaulting: false }),
    (magicGroups, skillGroups): DicePoolConfig => ({
      id: "magic.spellcasting",
      label: "Spellcasting",
      groups: [...magicGroups, ...skillGroups],
    }),
  )

  /** The Drain Resistance test: Willpower + the tradition's drain `attr`. */
  export const selectDrainResistanceTest = createDicePoolSelector(
    selectWillpowerTest,
    DiceGroupSelectors.selectAttr,
    (willpowerGroups, drainAttrGroups): DicePoolConfig => ({
      id: "magic.drainResistance",
      label: "Drain Resistance",
      // A Resistance Test never takes the Wound Modifier.
      excludeWoundMod: true,
      groups: [
        ...willpowerGroups,
        // A Willpower-drain tradition rolls Willpower twice; renaming the second keeps the two
        // ledger rows distinguishable.
        ...drainAttrGroups.map((group) =>
          willpowerGroups.some((willpowerGroup) => willpowerGroup.name === group.name)
            ? { ...group, name: `${group.name} (Drain)` }
            : group,
        ),
      ],
    }),
  )

  /**
   * The Summoning or Binding test for `spiritType`: Magic + `skill`, plus the skill's
   * Specialization bonus when it covers that spirit type.
   */
  export const selectSummoningTest = createDicePoolSelector(
    selectMagicTest,
    DiceGroupSelectors.selectSkill,
    selectSpiritSpecializationTest,
    SelectorOptions.skill,
    (magicGroups, skillGroups, specializationGroups, skill): DicePoolConfig => ({
      id: `magic.${skill}`,
      label: skill === SkillKey.binding ? "Binding" : "Summoning",
      groups: [...magicGroups, ...skillGroups, ...specializationGroups],
    }),
  )
}
