import { FC } from 'react'

import { useAttribute } from '../System/AttributeProvider'
import { DicePool } from '../UI/DicePool'
import { CharacterAttr } from './CharacterData'

export const DodgePool: FC = () => {
  const reaction = useAttribute(CharacterAttr.reaction, 0)
  const intuition = useAttribute(CharacterAttr.intuition, 0)

  const diceGroups = [
    { name: 'Reaction', size: reaction },
    { name: 'Intution', size: intuition },
  ]

  return (
    <DicePool name={'Dodge'} groups={diceGroups} />
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
