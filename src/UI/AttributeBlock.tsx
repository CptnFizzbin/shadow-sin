import { FC } from 'react'

import { AttrList, formatAttr } from '../System/Attribute'
import { Stat, StatBlock } from './StatBlock'

interface AttributeBlockProps {
  attributes: AttrList
  vertical?: boolean
}

export const AttributeBlock: FC<AttributeBlockProps> = ({
  attributes,
  vertical,
}) => {
  if (!attributes) return null
  if (Object.keys(attributes).length === 0) return null

  return (
    <StatBlock vertical={vertical}>
      {Object.entries(attributes).map(([type, value]) => (
        <Stat key={type} name={formatAttr(type)} value={value} />
      ))}
    </StatBlock>
  )
}
