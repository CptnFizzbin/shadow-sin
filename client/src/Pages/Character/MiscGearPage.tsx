import { Stack, Typography } from '@mui/material'
import React, { FC } from 'react'

import { useAllGear } from '../../Gear/GearContext'
import { GearType } from '../../Gear/GearData'
import { GearList } from '../../Gear/GearList'

export const MiscGearPage: FC = () => {
  const excludedGear: GearType[] = [
    GearType.weapon,
    GearType.vehicle,
    GearType.augment,
    GearType.sin,
    GearType.license,
  ]

  const otherGear = useAllGear()
    .filter(gear => !gear.attachedTo)
    .filter(gear => !excludedGear.includes(gear.gearType))

  return (
    <Stack gap={1}>
      <Typography variant={'h4'}>Other Gear</Typography>
      <GearList gear={otherGear} />
      <Stack />
      )
      }
