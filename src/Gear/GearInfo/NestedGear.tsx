import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { AttributeProvider } from '../../System/AttributeProvider'
import { useAttachedGear } from '../GearContext'
import { GearList } from '../GearList'
import { GearInfoSectionProps } from './GearInfoSectionProps'

export const NestedGear: FC<GearInfoSectionProps> = ({
  item,
}) => {
  const attachedGear = useAttachedGear(item.id)
  if (attachedGear.length === 0) return null

  return (
    <Paper variant="outlined" sx={{ padding: 1 }}>
      <AttributeProvider attributes={item.attributes || {}}>
        <GearList gear={attachedGear} />
      </AttributeProvider>
    </Paper>
  )
}
