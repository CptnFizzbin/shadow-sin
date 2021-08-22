import { FC } from 'react'

import { useAttribute } from '../System/AttributeProvider'
import { useDamagePenalty } from '../System/Damage/DamageContext'
import { DamageType } from '../System/Damage/DamageType'
import { DiceGroup, DicePool } from '../UI/DicePool'
import { CharacterAttr } from './CharacterData'

export const DodgePool: FC = () => {
  const reaction = useAttribute<number>(CharacterAttr.reaction, 0)
  const intuition = useAttribute<number>(CharacterAttr.intuition, 0)
  const dmgPenalty = useDamagePenalty([DamageType.charPhysical, DamageType.charStun])

  const diceGroups: DiceGroup[] = [
    { name: 'Reaction', size: reaction },
    { name: 'Intution', size: intuition },
  ]

  return (
    <DicePool name={'Dodge'} groups={diceGroups} damagePenalty={dmgPenalty} />
  )
}

export const ResistDamagePool: FC = () => {
  const body = useAttribute(CharacterAttr.body, 0)

  const diceGroups = [
    { name: 'Body', size: body },
  ]

  return (
    <DicePool name={'Resist Dmg.'} groups={diceGroups} />
  )
}
