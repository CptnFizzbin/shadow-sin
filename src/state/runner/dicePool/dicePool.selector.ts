import type { DicePoolConfig } from "#/components/system/dicePool/dicePoolData.tsx"
import { DiceGroupSelectors } from "#/state/runner/diceGroup/diceGroup.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { AttributeLabels } from "#/system/model/attributes/attributeKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

export namespace DicePoolSelectors {
  /**
   * A Standard Test rolling `attr` + `skill`: the Attribute, the skill, its Specialization bonus
   * when `specialization` is given, and the Wound Modifier.
   */
  export const selectStandardTest = createDicePoolSelector(
    DiceGroupSelectors.selectAttr,
    DiceGroupSelectors.selectSkill,
    DiceGroupSelectors.selectSpecialization,
    SelectorOptions.attr,
    SelectorOptions.skill,
    (attrGroups, skillGroups, specializationGroups, attr, skill): DicePoolConfig => ({
      id: `standardTest.${attr}.${skill}`,
      label: `${AttributeLabels[attr]} + ${skill}`,
      groups: [...attrGroups, ...skillGroups, ...specializationGroups],
    }),
  )
}
