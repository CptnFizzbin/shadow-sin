import { FC } from 'react'

import { AttrList, AttrNames } from '../System/Attribute'
import { Stat, StatBlock } from './StatBlock'

interface AttributeBlockProps {
  attributes: AttrList
}

let attributeNames: AttrNames = {}

export const registerAttrNames = (names: AttrNames): void => {
  attributeNames = {
    ...attributeNames,
    ...names,
  }
}

export const AttributeBlock: FC<AttributeBlockProps> = ({
  attributes,
}) => {
  if (!attributes) return null

  return (
    <StatBlock>
      {Object.entries(attributes).map(([type, value]) => (
        <Stat key={type} name={attributeNames[type] || type} value={value} />
      ))}
    </StatBlock>
  )
}
