import type { DicePoolConfig } from "#/components/system/dicePool/dicePoolData.tsx"
import { injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { SRC } from "#/system/model/systemValues.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"
import { DicePoolSelectors } from "./dicePool.selector.ts"

/** Builds the dice pool id and label for a skill test, suffixed with its specialization if any. */
const skillPoolIdentity = (idPrefix: string, name: string, specialization?: string) => ({
  id: specialization ? `${idPrefix}.${name}.${specialization}` : `${idPrefix}.${name}`,
  label: specialization ? `${name} (${specialization})` : name,
})

export namespace SkillPoolSelectors {
  /** An Active Skill test: the skill, `attr`, and the `specialization` bonus when one is given. */
  export const selectActiveSkillTest = createDicePoolSelector(
    DicePoolSelectors.selectSkillTest,
    DicePoolSelectors.selectAttrTest,
    DicePoolSelectors.selectSpecializationTest,
    SelectorOptions.skill,
    SelectorOptions.specialization,
    (skillGroups, attrGroups, specializationGroups, skill, specialization): DicePoolConfig => ({
      ...skillPoolIdentity("skill.active", skill, specialization),
      groups: [...skillGroups, ...attrGroups, ...specializationGroups],
    }),
  )

  /** A Knowledge Skill test: the skill's `rating`, Logic, and the `specialization` bonus when one is given. */
  export const selectKnowledgeSkillTest = createDicePoolSelector(
    injectOption(DicePoolSelectors.selectAttrTest, { attr: AttributeKey.logic }),
    SelectorOptions.knowledge,
    SelectorOptions.rating,
    SelectorOptions.specialization,
    (attrGroups, knowledge, rating, specialization): DicePoolConfig => ({
      ...skillPoolIdentity("skill.knowledge", knowledge, specialization),
      groups: [
        { name: knowledge, size: rating },
        ...attrGroups,
        ...(specialization ? [{ name: specialization, size: SRC.Skills.Specialization.Modifier }] : []),
      ],
    }),
  )

  /**
   * A Language Skill test: the skill's `rating` (none for a native language, which always succeeds
   * automatically), Intuition, and the `lingo` bonus when one is given.
   */
  export const selectLanguageSkillTest = createDicePoolSelector(
    injectOption(DicePoolSelectors.selectAttrTest, { attr: AttributeKey.intuition }),
    SelectorOptions.language,
    SelectorOptions.isNative,
    SelectorOptions.rating,
    SelectorOptions.lingo,
    (attrGroups, language, isNative, rating, lingo): DicePoolConfig => ({
      ...skillPoolIdentity("skill.language", language, lingo),
      groups: [
        { name: language, size: isNative ? 0 : rating },
        ...attrGroups,
        ...(lingo ? [{ name: lingo, size: SRC.Skills.Specialization.Modifier }] : []),
      ],
    }),
  )
}
