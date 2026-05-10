import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/components/system/dicePool/useDiceGroup.ts"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { useActiveSkillRating } from "./useActiveSkillHooks.ts"

export const useActiveSkillDicePool = (props: {
  skillKey: SkillKey
  specialization?: string
  attrOverride?: AttributeKey
}): DicePoolData => {
  const { skillKey, specialization, attrOverride } = props
  const { attr: defaultAttr, defaultable } = skillList[skillKey]
  const attr = attrOverride ?? defaultAttr

  const skillRating = useActiveSkillRating(skillKey)
  const isDefaulted = skillRating === 0 && (defaultable ?? true)

  let id = `skill.active.${skillKey}`
  let name = skillKey.toString()
  if (specialization) {
    id += `.${specialization}`
    name += ` (${specialization})`
  }

  const specMods = useGameEffects(GameEffectType.skillSpecializationMod)
  const totalSpecMod = specialization
    ? specMods
        .filter((e) => e.target === skillKey && e.subTarget === specialization)
        .reduce((sum, e) => sum + e.value, 0)
    : 0

  return createDicePool(id, name, [
    useActiveSkillDiceGroup(skillKey),
    useAttrDiceGroup(attr),
    isDefaulted ? { name: "Defaulting", size: -1, color: "warning.main" } : null,
    specialization ? { name: specialization, size: 2 + totalSpecMod } : null,
    useWoundDiceGroup(),
  ])
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

  return createDicePool(id, name, [
    { name: knowledge, size: rating },
    useAttrDiceGroup(AttributeKey.logic),
    specialization ? { name: specialization, size: 2 } : null,
    useWoundDiceGroup(),
  ])
}

export const useLanguageSkillDicePool = (props: {
  language: string
  rating: number | "native"
  lingo?: string
}): DicePoolData => {
  const { language, rating, lingo } = props

  let name = language
  let id = `skill.language.${language}`
  if (lingo) {
    id += `.${lingo}`
    name += ` (${lingo})`
  }

  return createDicePool(id, name, [
    { name: language, size: rating === "native" ? 0 : rating },
    useAttrDiceGroup(AttributeKey.intuition),
    lingo ? { name: lingo, size: 2 } : null,
    useWoundDiceGroup(),
  ])
}
