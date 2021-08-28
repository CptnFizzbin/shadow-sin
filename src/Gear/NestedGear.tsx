import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { AttributeProvider } from '../System/AttributeProvider'
import { useAttachedGear } from './GearContext'
import { GearData } from './GearData'
import { GearList } from './GearList'

export interface NestedGearProps {
  item: GearData
}

export const NestedGear: FC<NestedGearProps> = ({
  item,
}) => {
  const attachedGear = useAttachedGear(item.id)
  if (attachedGear.length === 0) return null

  return (
    <Paper variant="outlined" sx={{ padding: 1 }}>
      <AttributeProvider attributes={item.attributes || {}}>
        <GearList gear={attachedGear} expanded={false}/>
      </AttributeProvider>
    </Paper>
  )
}
