import { FC } from 'react'

import { toTitleCase } from '../Helpers'
import { Stat } from '../UI/StatBlock'

export interface AttributeData {
  name: string
  value: number
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
