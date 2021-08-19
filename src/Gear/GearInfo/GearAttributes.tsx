import { FC } from 'react'

import { AttributeBlock } from '../../UI/AttributeBlock'
import { InfoSection } from '../../UI/InfoBlock/InfoSection'
import { GearInfoSectionProps } from './GearInfoSectionProps'

export const GearAttributes: FC<GearInfoSectionProps> = ({
  item,
}) => {
  if (!item.attributes) return null

  return (
    <InfoSection>
      <AttributeBlock attributes={item.attributes} />
    </InfoSection>
  )
}
