import { FC } from 'react'

import { AttributeBlock } from '../UI/AttributeBlock'
import { InfoSection } from '../UI/InfoBlock/InfoSection'
import { GearData } from './GearData'

interface GearAttributesProps {
  item: GearData
}

export const GearAttributes: FC<GearAttributesProps> = ({
  item,
}) => {
  if (!item.attributes) return null

  return (
    <InfoSection>
      <AttributeBlock attributes={item.attributes} />
    </InfoSection>
  )
}
