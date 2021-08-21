import { FC } from 'react'

import { AttrNames } from '../../System/Attribute'
import { AttributeBlock } from '../../UI/AttributeBlock'
import { InfoSection } from '../../UI/InfoBlock/InfoSection'
import { GearData } from '../GearData'

interface GearAttributesProps {
  item: GearData
  attrNames: AttrNames
}

export const GearAttributes: FC<GearAttributesProps> = ({
  item,
  attrNames = {},
}) => {
  if (!item.attributes) return null

  return (
    <InfoSection>
      <AttributeBlock attributes={item.attributes} names={attrNames} />
    </InfoSection>
  )
}
