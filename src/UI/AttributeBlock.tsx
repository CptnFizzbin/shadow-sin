import { FC } from 'react'

import { AttrList, AttrNames } from '../System/Attribute'
import { Stat, StatBlock } from './StatBlock'

let attributeNames: AttrNames = {}

export const registerAttrNames = (names: AttrNames): void => {
  attributeNames = {
    ...attributeNames,
    ...names,
  }
}

interface AttributeBlockProps {
  attributes: AttrList
  vertical?: boolean
}

export const AttributeBlock: FC<AttributeBlockProps> = ({
  attributes,
  vertical,
}) => {
  if (!attributes) return null

  return (
    <StatBlock vertical={vertical}>
      {Object.entries(attributes).map(([type, value]) => (
        <Stat key={type} name={attributeNames[type] || type} value={value} />
      ))}
    </StatBlock>
  )
}
