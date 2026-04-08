import { useActiveSkillRating } from "#/components/character/characterUtils.ts"
import type { DicePoolData } from "#/components/dicePool/dicePoolData.tsx"
import { createDicePool } from "#/components/dicePool/dicePoolData.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/components/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { SkillKey } from "#/lib/system/skillKey.ts"
import { skills } from "#/lib/system/skillKey.ts"

export const useActiveSkillDicePool = (props: {
  skillKey: SkillKey
  specialization?: string
}): DicePoolData => {
  const { skillKey, specialization } = props
  const { attr, defaultable } = skills[skillKey]

  const skillRating = useActiveSkillRating(skillKey)
  const isDefaulted = skillRating === 0 && (defaultable ?? true)

  let id = `skill.active.${skillKey}`
  let name = skillKey.toString()
  if (specialization) {
    id += `.${specialization}`
    name += ` (${specialization})`
  }

  return createDicePool(id, name, [
    useActiveSkillDiceGroup(skillKey),
    useAttrDiceGroup(attr),
    isDefaulted ? { name: "Defaulting", size: -1, color: "warning.main" } : null,
    specialization ? { name: specialization, size: 2 } : null,
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
