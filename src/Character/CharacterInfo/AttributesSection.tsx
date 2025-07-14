import { FC } from 'react'

import { useAttributes } from '../../System/AttributeProvider'
import { AttributeBlock } from '../../UI/AttributeBlock'
import { CharacterAttr } from '../CharacterAttr'

export const AttributesSection: FC = () => {
  const charAttributes = useAttributes([
    CharacterAttr.body,
    CharacterAttr.agility,
    CharacterAttr.reaction,
    CharacterAttr.strength,
    CharacterAttr.willpower,
    CharacterAttr.logic,
    CharacterAttr.intuition,
    CharacterAttr.charisma,
    CharacterAttr.edge,
    CharacterAttr.essence,
    CharacterAttr.magic,
    CharacterAttr.resonance,
  ])

  const magic = charAttributes[CharacterAttr.magic]
  if (!magic) delete charAttributes[CharacterAttr.magic]

  const resonance = charAttributes[CharacterAttr.resonance]
  if (!resonance) delete charAttributes[CharacterAttr.resonance]

  return <AttributeBlock attributes={charAttributes} />
}
