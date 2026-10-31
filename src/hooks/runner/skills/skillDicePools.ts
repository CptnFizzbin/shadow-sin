import { flattenDiceGroups } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/hooks/system/dicePool/useDiceGroup.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"

export const useActiveSkillDicePool = (props: {
  skillKey: SkillKey
  specialization?: string
  attrOverride?: AttributeKey
}): DicePoolData => {
  const { skillKey, specialization, attrOverride } = props
  const { attr: defaultAttr } = skillList[skillKey]
  const attr = attrOverride ?? defaultAttr

  let id = `skill.active.${skillKey}`
  let name = skillKey.toString()
  if (specialization) {
    id += `.${specialization}`
    name += ` (${specialization})`
  }

  const specMods = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.skillSpecializationMod })
  const totalSpecMod = specialization
    ? specMods
        .filter((e) => e.target === skillKey && e.subTarget === specialization)
        .reduce((sum, e) => sum + e.value, 0)
    : 0

  const skillGroup = useActiveSkillDiceGroup(skillKey)
  const attrGroup = useAttrDiceGroup(attr)
  const woundGroup = useWoundDiceGroup()

  return createDicePool({
    id,
    label: name,
    groups: flattenDiceGroups([
      skillGroup,
      attrGroup,
      specialization ? { name: specialization, size: 2 + totalSpecMod } : null,
      woundGroup,
    ]),
  })
}

export const useKnowledgeSkillDicePool = (props: {
  knowledge: string
  rating: number
  specialization?: string
}): DicePoolData => {
  const { knowledge, rating, specialization } = props

  let id = `skill.knowledge.${knowledge}`
  let name = knowledge
  if (specialization) {
    id += `.${specialization}`
    name += ` (${specialization})`
  }

  const attrGroup = useAttrDiceGroup(AttributeKey.logic)
  const woundGroup = useWoundDiceGroup()

  return createDicePool({
    id,
    label: name,
    groups: flattenDiceGroups([
      { name: knowledge, size: rating },
      attrGroup,
      specialization ? { name: specialization, size: 2 } : null,
      woundGroup,
    ]),
  })
}

export const useLanguageSkillDicePool = (props: {
  language: string
  /** A native Language skill has no dice pool to roll — it always succeeds automatically. */
  isNative: boolean
  rating: number
  lingo?: string
}): DicePoolData => {
  const { language, isNative, rating, lingo } = props

  let name = language
  let id = `skill.language.${language}`
  if (lingo) {
    id += `.${lingo}`
    name += ` (${lingo})`
  }

  const attrGroup = useAttrDiceGroup(AttributeKey.intuition)
  const woundGroup = useWoundDiceGroup()

  return createDicePool({
    id,
    label: name,
    groups: flattenDiceGroups([
      { name: language, size: isNative ? 0 : rating },
      attrGroup,
      lingo ? { name: lingo, size: 2 } : null,
      woundGroup,
    ]),
  })
}
