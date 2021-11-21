import { FC } from 'react'

import { CharacterAttr } from '../Character/CharacterAttr'
import { useCharacterData } from '../Character/CharacterProvider'
import { ActiveSkill } from '../System/Skill/ActiveSkill/ActiveSkillId'
import { DicePool } from '../UI/DicePool'

export const SorcerySpellcastingPool: FC = () => {
  return (
    <DicePool
      name="Spellcasting"
      skills={[ActiveSkill.sorcery]}
      attrs={[CharacterAttr.magic]}
    />
  )
}

export const ConjurationSpellcastingPool: FC = () => {
  return (
    <DicePool
      name="Spellcasting"
      skills={[ActiveSkill.conjuration]}
      attrs={[CharacterAttr.magic]}
    />
  )
}

export const EnchantingSpellcastingPool: FC = () => {
  return (
    <DicePool
      name="Spellcasting"
      skills={[ActiveSkill.enchanting]}
      attrs={[CharacterAttr.magic]}
    />
  )
}

export const ResistDrain: FC = () => {
  const characterData = useCharacterData()
  if (!characterData) return null

  const spellcastingAttr = characterData.spellcastingAttr || CharacterAttr.charisma

  return (
    <DicePool
      name="Drain"
      attrs={[CharacterAttr.willpower, spellcastingAttr]}
    />
  )
}
