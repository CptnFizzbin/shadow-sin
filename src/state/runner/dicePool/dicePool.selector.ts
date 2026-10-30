import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { DiceGroupSelectors } from "#/state/runner/diceGroup/diceGroup.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { AttributeKey, AttributeLabels } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"

const skillPoolId = (baseId: string, specialization?: string): string =>
  specialization ? `${baseId}.${specialization}` : baseId

const skillPoolName = (skillName: string, specialization?: string): string =>
  specialization ? `${skillName} (${specialization})` : skillName

/**
 * Whole dice pools for a test, each assembled only from `DiceGroupSelectors` groups. Use
 * `DiceGroupSelectors` directly when a caller needs to add its own groups alongside.
 */
export namespace DicePoolSelectors {
  /** A Standard Test rolling `attr` + `skill`: the Attribute, then the skill's groups. */
  export const selectStandardTest = createMemoizedSelector(
    DiceGroupSelectors.selectAttr,
    DiceGroupSelectors.selectSkill,
    SelectorOptions.attr,
    SelectorOptions.skill,
    (attrGroups, skillGroups, attr, skill): DicePoolData =>
      createDicePool(
        `standardTest.${attr}.${skill}`,
        `${AttributeLabels[attr]} + ${skill}`,
        [...attrGroups, ...skillGroups],
      ),
  )

  /**
   * An Active Skill test as listed on the skills page: the skill (with `specialization`'s bonus
   * when given), its linked Attribute or `attrOverride`, and the Wound Modifier.
   */
  export const selectActiveSkill = createMemoizedSelector(
    DiceGroupSelectors.selectSkill,
    (state: EntityScope, { skill, attrOverride }: { skill: SkillKey, attrOverride?: AttributeKey }) =>
      DiceGroupSelectors.selectAttr(state, { attr: attrOverride ?? skillList[skill].attr }),
    DiceGroupSelectors.selectWound,
    SelectorOptions.skill,
    SelectorOptions.specialization,
    (skillGroups, attrGroups, woundGroups, skill, specialization): DicePoolData =>
      createDicePool(
        skillPoolId(`skill.active.${skill}`, specialization),
        skillPoolName(skill, specialization),
        [...skillGroups, ...attrGroups, ...woundGroups],
      ),
  )

  /** A Knowledge Skill test: the skill (with `specialization`'s bonus when given), Logic, and the Wound Modifier. */
  export const selectKnowledgeSkill = createMemoizedSelector(
    DiceGroupSelectors.selectKnowledgeSkill,
    injectOption(DiceGroupSelectors.selectAttr, { attr: AttributeKey.logic }),
    DiceGroupSelectors.selectWound,
    SelectorOptions.knowledge,
    SelectorOptions.specialization,
    (skillGroups, attrGroups, woundGroups, knowledge, specialization): DicePoolData =>
      createDicePool(
        skillPoolId(`skill.knowledge.${knowledge}`, specialization),
        skillPoolName(knowledge, specialization),
        [...skillGroups, ...attrGroups, ...woundGroups],
      ),
  )

  /** A Language Skill test: the skill (with `lingo`'s bonus when given), Intuition, and the Wound Modifier. */
  export const selectLanguageSkill = createMemoizedSelector(
    DiceGroupSelectors.selectLanguageSkill,
    injectOption(DiceGroupSelectors.selectAttr, { attr: AttributeKey.intuition }),
    DiceGroupSelectors.selectWound,
    SelectorOptions.language,
    SelectorOptions.lingo,
    (skillGroups, attrGroups, woundGroups, language, lingo): DicePoolData =>
      createDicePool(
        skillPoolId(`skill.language.${language}`, lingo),
        skillPoolName(language, lingo),
        [...skillGroups, ...attrGroups, ...woundGroups],
      ),
  )
}
