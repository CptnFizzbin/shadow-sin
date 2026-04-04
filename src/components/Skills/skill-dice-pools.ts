import type { DicePoolData } from "#/components/DicePool/dice-pool-data.tsx"
import { createDicePool } from "#/components/DicePool/dice-pool-data.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/components/DicePool/use-dice-group.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import type { SkillKey } from "#/lib/system/skill-key.ts"
import { skills } from "#/lib/system/skill-key.ts"

export const useActiveSkillDicePool = (props: {
  skillKey: SkillKey
  specialization?: string
}): DicePoolData => {
  const { skillKey, specialization } = props
  const { attr } = skills[skillKey]

  let id = `skill.active.${skillKey}`
  let name = skillKey.toString()
  if (specialization) {
    id += `.${specialization}`
    name += ` (${specialization})`
  }

  return createDicePool(id, name, [
    useActiveSkillDiceGroup(skillKey),
    useAttrDiceGroup(attr),
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
