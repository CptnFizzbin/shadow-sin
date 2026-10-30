import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { DicePoolSelectors } from "#/state/runner/dicePool/dicePool.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"

/** @deprecated - use `useRunnerSelector(DicePoolSelectors.selectActiveSkillPool, { skill, specialization, attrOverride })` instead */
export const useActiveSkillDicePool = (props: {
  skillKey: SkillKey
  specialization?: string
  attrOverride?: AttributeKey
}): DicePoolData => {
  const { skillKey, specialization, attrOverride } = props
  return useRunnerSelector(DicePoolSelectors.selectActiveSkillPool, { skill: skillKey, specialization, attrOverride })
}

/** @deprecated - use `useRunnerSelector(DicePoolSelectors.selectKnowledgeSkillPool, { knowledge, rating, specialization })` instead */
export const useKnowledgeSkillDicePool = (props: {
  knowledge: string
  rating: number
  specialization?: string
}): DicePoolData => {
  return useRunnerSelector(DicePoolSelectors.selectKnowledgeSkillPool, props)
}

/** @deprecated - use `useRunnerSelector(DicePoolSelectors.selectLanguageSkillPool, { language, isNative, rating, lingo })` instead */
export const useLanguageSkillDicePool = (props: {
  language: string
  /** A native Language skill has no dice pool to roll — it always succeeds automatically. */
  isNative: boolean
  rating: number
  lingo?: string
}): DicePoolData => {
  return useRunnerSelector(DicePoolSelectors.selectLanguageSkillPool, props)
}
