import { FC } from 'react'

import { toTitleCase } from '../Helpers'
import { Stat } from '../UI/StatBlock'

export type AttributeValue = number | string | null

export interface AttributeList {
  [type: string]: AttributeData
}

export type AttributeData<T extends AttributeValue = AttributeValue> = {
  name: string
  value: T
}

interface AttributeStatProps {
  attr: AttributeData
}

export const AttributeStat: FC<AttributeStatProps> = ({
  attr,
}) => {
  return (
    <Stat name={toTitleCase(attr.name)} value={attr.value} />
  )
}
