import { Typography } from '@material-ui/core'
import React, { FC } from 'react'

import { useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearList } from '../GearList'
import { VehicleData } from './VehicleData'

export const VehiclesPage: FC = () => {
  const vehicles = useGearOfType<VehicleData>(GearType.vehicle)

  return (
    <>
      <Typography variant={'h4'}>Vehicles</Typography>
      <GearList gear={vehicles} />
    </>
  )
}
