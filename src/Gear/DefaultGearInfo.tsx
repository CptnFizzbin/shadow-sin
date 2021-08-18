import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { GearAttributes } from './GearAttributes'
import { GearData } from './GearData'
import { GearHeader } from './GearHeader'
import { NestedGear } from './NestedGear'

interface OtherGearInfoProps {
  item: GearData
}

export const DefaultGearInfo: FC<OtherGearInfoProps> = ({
  item,
}) => {
  return (
    <Paper elevation={1}>
      <GearHeader item={item} />
      <GearAttributes item={item} />
      <NestedGear item={item} />
    </Paper>
  )
}
