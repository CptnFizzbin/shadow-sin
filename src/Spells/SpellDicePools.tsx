import { FC } from 'react'

import { CharacterAttr } from '../Character/CharacterAttr'
import { useCharacterData } from '../Character/CharacterProvider'
import { ActiveSkillIds } from '../Skills'
import { DicePool } from '../UI/DicePool'

export const SorcerySpellcastingPool: FC = () => {
  return (
    <DicePool
      name="Spellcasting"
      skills={[ActiveSkillIds.CRB.sorcery]}
      attrs={[CharacterAttr.magic]}
    />
  )
}

export const ConjuringSpellcastingPool: FC = () => {
  return (
    <DicePool
      name="Spellcasting"
      skills={[ActiveSkillIds.CRB.conjuring]}
      attrs={[CharacterAttr.magic]}
    />
  )
}

export const EnchantingSpellcastingPool: FC = () => {
  return (
    <DicePool
      name="Spellcasting"
      skills={[ActiveSkillIds.CRB.enchanting]}
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
