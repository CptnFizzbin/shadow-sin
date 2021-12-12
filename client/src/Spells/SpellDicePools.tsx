import { FC } from 'react'

import { CharacterAttr } from '../Character/CharacterAttr'
import { useCharacterData } from '../Character/CharacterProvider'
import { ActiveSkillName } from '../Skills'
import { DicePool } from '../UI/DicePool'

export const SorcerySpellcastingPool: FC = () => {
  return (
    <DicePool
      name="Spellcasting"
      skills={[ActiveSkillName.sorcery]}
      attrs={[CharacterAttr.magic]}
    />
  )
}

export const ConjuringSpellcastingPool: FC = () => {
  return (
    <DicePool
      name="Spellcasting"
      skills={[ActiveSkillName.conjuring]}
      attrs={[CharacterAttr.magic]}
    />
  )
}

export const EnchantingSpellcastingPool: FC = () => {
  return (
    <DicePool
      name="Spellcasting"
      skills={[ActiveSkillName.enchanting]}
      attrs={[CharacterAttr.magic]}
    />
  )
}

export const ResistDrain: FC = () => {
  const characterData = useCharacterData()
  if (!characterData) return null

  const spellDrainAttr = characterData.spellDrainAttr || CharacterAttr.charisma

  return (
    <DicePool
      name="Drain"
      attrs={[CharacterAttr.willpower, spellDrainAttr]}
    />
  )
}
