import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { SkillPoolSelectors } from "#/state/runner/dicePool/skillPools.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"

export const useActiveSkillDicePool = (props: {
  skillKey: SkillKey
  specialization?: string
  attrOverride?: AttributeKey
}): DicePoolData => {
  const { skillKey, specialization, attrOverride } = props

  return useRunnerSelector(SkillPoolSelectors.selectActiveSkillTest, {
    skill: skillKey,
    attr: attrOverride ?? skillList[skillKey].attr,
    specialization,
  })
}

export const useKnowledgeSkillDicePool = (props: {
  knowledge: string
  rating: number
  specialization?: string
}): DicePoolData => {
  const { knowledge, rating, specialization } = props
  return useRunnerSelector(SkillPoolSelectors.selectKnowledgeSkillTest, { knowledge, rating, specialization })
}

export const useLanguageSkillDicePool = (props: {
  language: string
  /** A native Language skill has no dice pool to roll — it always succeeds automatically. */
  isNative: boolean
  rating: number
  lingo?: string
}): DicePoolData => {
  const { language, isNative, rating, lingo } = props
  return useRunnerSelector(SkillPoolSelectors.selectLanguageSkillTest, { language, isNative, rating, lingo })
}
