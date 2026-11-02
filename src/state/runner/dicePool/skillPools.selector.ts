import { injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

/** Skill test pools. Their labels are generic; the component showing one names the skill. */
export namespace SkillPoolSelectors {
  /** An Active Skill test: the skill, `attr`, and the `specialization` bonus when one is given. */
  export const selectActiveSkillTest = createDicePoolSelector({
    id: "skill.active",
    label: "Active Skill",
    groups: [
      SkillsSelectors.DiceGroups.selectSkill,
      AttrSelectors.DiceGroups.selectAttr,
      SkillsSelectors.DiceGroups.selectSpecialization,
    ],
  })

  /** A Knowledge Skill test: the skill's `rating` and Specialization bonus, then Logic. */
  export const selectKnowledgeSkillTest = createDicePoolSelector({
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
  export const selectLanguageSkillTest = createDicePoolSelector({
    id: "skill.language",
    label: "Language Skill",
    groups: [
      SkillsSelectors.DiceGroups.selectLanguageSkill,
      injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.intuition }),
    ],
  })
}
