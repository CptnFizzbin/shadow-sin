import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { SkillPoolSelectors } from "#/state/runner/dicePool/skillPools.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"

/**
 * Names a skill pool after its skill (and specialization, if any). The pool selectors use fixed
 * ids and labels, and a skill's plain and specialized pools are shown side by side, keyed by id.
 */
const nameSkillPool = (pool: DicePoolData, name: string, specialization?: string): DicePoolData => ({
  ...pool,
  id: specialization ? `${pool.id}.${name}.${specialization}` : `${pool.id}.${name}`,
  label: specialization ? `${name} (${specialization})` : name,
})

export const useActiveSkillDicePool = (props: {
  skillKey: SkillKey
  specialization?: string
  attrOverride?: AttributeKey
}): DicePoolData => {
  const { skillKey, specialization, attrOverride } = props

  const pool = useRunnerSelector(SkillPoolSelectors.selectActiveSkillTest, {
    skill: skillKey,
    attr: attrOverride ?? skillList[skillKey].attr,
    specialization,
  })
  return nameSkillPool(pool, skillKey, specialization)
}

export const useKnowledgeSkillDicePool = (props: {
  knowledge: string
  rating: number
  specialization?: string
}): DicePoolData => {
  const { knowledge, rating, specialization } = props
  const pool = useRunnerSelector(SkillPoolSelectors.selectKnowledgeSkillTest, { knowledge, rating, specialization })
  return nameSkillPool(pool, knowledge, specialization)
}

export const useLanguageSkillDicePool = (props: {
  language: string
  /** A native Language skill has no dice pool to roll — it always succeeds automatically. */
  isNative: boolean
  rating: number
  lingo?: string
}): DicePoolData => {
  const { language, isNative, rating, lingo } = props
  const pool = useRunnerSelector(SkillPoolSelectors.selectLanguageSkillTest, { language, isNative, rating, lingo })
  return nameSkillPool(pool, language, lingo)
}
