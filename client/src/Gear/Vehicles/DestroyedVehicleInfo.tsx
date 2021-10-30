import { FC } from 'react'

import { InfoBlock } from '../../UI/InfoBlock/InfoBlock'
import { GearInfoProps } from '../GearInfo'
import { VehicleData } from './VehicleData'

export const DestroyedVehicleInfo: FC<GearInfoProps<VehicleData>> = ({
  item: vehicle,
  expanded,
}) => {
  return (
    <InfoBlock
      expanded={expanded}
      title={<span style={{textDecoration: 'line-through'}}>{vehicle.name}</span>}
    />
  )
}
