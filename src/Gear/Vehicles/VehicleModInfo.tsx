import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { GearHeader } from '../GearInfo/GearHeader'
import { NestedGear } from '../GearInfo/NestedGear'
import { VehicleModData } from './VehicleModData'

interface VehicleModInfoProps {
  mod: VehicleModData
}

export const VehicleModInfo: FC<VehicleModInfoProps> = ({
  mod,
}) => {
  return (
    <Paper elevation={1}>
      <GearHeader item={mod} />
      <NestedGear item={mod} />
    </Paper>
  )
}
