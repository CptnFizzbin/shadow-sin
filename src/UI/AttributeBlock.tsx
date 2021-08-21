import { FC } from 'react'

import { AttrList, AttrNames } from '../System/Attribute'
import { Stat, StatBlock } from './StatBlock'

interface AttributeBlockProps {
  attributes: AttrList
  names: AttrNames
}

export const AttributeBlock: FC<AttributeBlockProps> = ({
  attributes,
  names,
}) => {
  if (!attributes) return null

  return (
    <StatBlock>
      {Object.entries(attributes).map(([type, value]) => (
        <Stat key={type} name={names[type] || type} value={value} />
      ))}
    </StatBlock>
  )
}
