import type { DicePoolConfig } from "#/components/system/dicePool/dicePoolData.tsx"
import { injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { DiceGroupSelectors } from "#/state/runner/diceGroup/diceGroup.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

/** Builds the dice pool id and label for a skill test, suffixed with its specialization if any. */
const skillPoolIdentity = (idPrefix: string, name: string, specialization?: string) => ({
  id: specialization ? `${idPrefix}.${name}.${specialization}` : `${idPrefix}.${name}`,
  label: specialization ? `${name} (${specialization})` : name,
})

export namespace SkillPoolSelectors {
  /** An Active Skill test: the skill, `attr`, and the `specialization` bonus when one is given. */
  export const selectActiveSkillTest = createDicePoolSelector(
    DiceGroupSelectors.selectSkill,
    DiceGroupSelectors.selectAttr,
    DiceGroupSelectors.selectSpecialization,
    SelectorOptions.skill,
    SelectorOptions.specialization,
    (skillGroups, attrGroups, specializationGroups, skill, specialization): DicePoolConfig => ({
      ...skillPoolIdentity("skill.active", skill, specialization),
      groups: [...skillGroups, ...attrGroups, ...specializationGroups],
    }),
  )

  /** A Knowledge Skill test: the skill's `rating` and Specialization bonus, then Logic. */
  export const selectKnowledgeSkillTest = createDicePoolSelector(
    DiceGroupSelectors.selectKnowledgeSkill,
    injectOption(DiceGroupSelectors.selectAttr, { attr: AttributeKey.logic }),
    SelectorOptions.knowledge,
    SelectorOptions.specialization,
    (skillGroups, attrGroups, knowledge, specialization): DicePoolConfig => ({
      ...skillPoolIdentity("skill.knowledge", knowledge, specialization),
      groups: [...skillGroups, ...attrGroups],
    }),
  )

  /**
   * A Language Skill test: the skill's `rating` (none for a native language, which always succeeds
   * automatically) and lingo bonus, then Intuition.
   */
  export const selectLanguageSkillTest = createDicePoolSelector(
    DiceGroupSelectors.selectLanguageSkill,
    injectOption(DiceGroupSelectors.selectAttr, { attr: AttributeKey.intuition }),
    SelectorOptions.language,
    SelectorOptions.lingo,
    (skillGroups, attrGroups, language, lingo): DicePoolConfig => ({
      ...skillPoolIdentity("skill.language", language, lingo),
      groups: [...skillGroups, ...attrGroups],
    }),
  )
}
