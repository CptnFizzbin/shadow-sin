import { FC } from 'react'

import { AttributeList } from '../System/Attribute'
import { Stat, StatBlock } from './StatBlock'

interface AttributeBlockProps {
  attributes: AttributeList
}

export const AttributeBlock: FC<AttributeBlockProps> = ({
  attributes,
}) => {
  if (!attributes) return null

  return (
    <StatBlock>
      {Object.entries(attributes).map(([type, attr]) => (
        <Stat key={type} name={attr.name} value={attr.value === null ? '-' : attr.value} />
      ))}
    </StatBlock>
  )
}
