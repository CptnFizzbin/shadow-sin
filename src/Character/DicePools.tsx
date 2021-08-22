import { FC } from 'react'

import { useAttribute } from '../System/AttributeProvider'
import { DamageType } from '../System/Damage/DamageType'
import { DiceGroup, DicePool } from '../UI/DicePool'
import { CharacterAttr } from './CharacterData'

export const DodgePool: FC = () => {
  const reaction = useAttribute<number>(CharacterAttr.reaction) || 0
  const intuition = useAttribute<number>(CharacterAttr.intuition) || 0

  const diceGroups: DiceGroup[] = [
    { name: 'Reaction', size: reaction },
    { name: 'Intution', size: intuition },
  ]

  return (
    <DicePool name={'Dodge'} groups={diceGroups} dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]} />
  )
}

export const ResistDamagePool: FC = () => {
  const body = useAttribute<number>(CharacterAttr.body) || 0

  const diceGroups: DiceGroup[] = [
    { name: 'Body', size: body },
  ]

  return (
    <DicePool name={'Resist Dmg.'} groups={diceGroups} dmgPenaltyTypes={[]} />
  )
}

export const ComposurePool: FC = () => {
  const willpower = useAttribute<number>(CharacterAttr.willpower) || 0
  const charisma = useAttribute<number>(CharacterAttr.charisma) || 0

  const diceGroups: DiceGroup[] = [
    { name: 'Willpower', size: willpower },
    { name: 'Charisma', size: charisma },
  ]

  return (
    <DicePool name={'Composure'} groups={diceGroups} dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]} />
  )
}

export const JudgeIntentPool: FC = () => {
  const willpower = useAttribute<number>(CharacterAttr.willpower) || 0
  const intuition = useAttribute<number>(CharacterAttr.intuition) || 0

  const diceGroups: DiceGroup[] = [
    { name: 'Willpower', size: willpower },
    { name: 'Intuition', size: intuition },
  ]

  return (
    <DicePool name={'Judge Intent'} groups={diceGroups} dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]} />
  )
}

export const MemoryPool: FC = () => {
  const logic = useAttribute<number>(CharacterAttr.logic) || 0
  const intuition = useAttribute<number>(CharacterAttr.intuition) || 0

  const diceGroups: DiceGroup[] = [
    { name: 'Logic', size: logic },
    { name: 'Intuition', size: intuition },
  ]

  return (
    <DicePool name={'Memory'} groups={diceGroups} dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]} />
  )
}

export const LiftPool: FC = () => {
  const body = useAttribute<number>(CharacterAttr.body) || 0
  const intuition = useAttribute<number>(CharacterAttr.intuition) || 0

  const diceGroups: DiceGroup[] = [
    { name: 'Body', size: body },
    { name: 'Intuition', size: intuition },
  ]

  return (
    <DicePool name={'Lift/Carry'} groups={diceGroups} dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]} />
  )
}
