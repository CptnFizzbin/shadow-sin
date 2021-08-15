import { FC } from 'react'

import { toTitleCase } from '../Helpers'
import { Stat } from '../UI/StatBlock'

export type Attribute =
  'body'
  | 'agility'
  | 'reaction'
  | 'strength'
  | 'willpower'
  | 'logic'
  | 'intuition'
  | 'charisma'
  | 'edge'
  | 'essence'
  | 'magic'
  | 'resonance'

interface AttributeStatProps {
  attr: string
  value: number
}

export const AttributeStat: FC<AttributeStatProps> = ({
  attr,
  value,
}) => {

  return (
    <Stat name={toTitleCase(attr)} value={value} />
  )
}
