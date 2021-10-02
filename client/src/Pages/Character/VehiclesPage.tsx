import { Typography } from '@mui/material'
import React, { FC } from 'react'

import { useGearOfType } from '../../Gear/GearContext'
import { GearType } from '../../Gear/GearData'
import { GearList } from '../../Gear/GearList'
import { VehicleData } from '../../Gear/Vehicles/VehicleData'

export const VehiclesPage: FC = () => {
  const vehicles = useGearOfType<VehicleData>(GearType.vehicle)

  return (
    <>
      <Typography variant={'h4'}>Vehicles</Typography>
      <GearList gear={vehicles} />
    </>
  )
}
