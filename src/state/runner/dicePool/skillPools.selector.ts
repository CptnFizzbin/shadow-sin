import { injectOption } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

/** Skill test pools. Their labels are generic; the component showing one names the skill. */
export namespace SkillPoolSelectors {
  /** An Active Skill test: the skill, `attr`, and the `specialization` bonus when one is given. */
  export const selectActiveSkillTest = createDicePoolSelector<EntityScope, {
    skill: SkillKey
    attr: AttributeKey
    specialization?: string
    excludeDefaulting?: boolean
  }>({
    id: "skill.active",
    label: "Active Skill",
    groups: [
      SkillsSelectors.DiceGroups.selectSkill,
      AttrSelectors.DiceGroups.selectAttr,
      SkillsSelectors.DiceGroups.selectSpecialization,
    ],
  })

  /** A Knowledge Skill test: the skill's `rating` and Specialization bonus, then Logic. */
  export const selectKnowledgeSkillTest = createDicePoolSelector<EntityScope, {
    knowledge: string
    rating: number
    specialization?: string
  }>({
    id: "skill.knowledge",
    label: "Knowledge Skill",
    groups: [
      SkillsSelectors.DiceGroups.selectKnowledgeSkill,
      injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.logic }),
    ],
  })

  /**
   * A Language Skill test: the skill's `rating` (none for a native language, which always succeeds
   * automatically) and lingo bonus, then Intuition.
   */
  export const selectLanguageSkillTest = createDicePoolSelector<EntityScope, {
    language: string
    isNative: boolean
    rating: number
    lingo?: string
  }>({
    id: "skill.language",
    label: "Language Skill",
    groups: [
      SkillsSelectors.DiceGroups.selectLanguageSkill,
      injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.intuition }),
    ],
  })
}
