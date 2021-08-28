import { Typography } from '@material-ui/core'
import React, { FC } from 'react'

import { useAllGear } from './GearContext'
import { GearType } from './GearData'
import { GearList } from './GearList'

export const MiscGearPage: FC = () => {
  const excludedGear: GearType[] = [
    GearType.weapon,
    GearType.vehicle,
  ]

  const otherGear = useAllGear()
    .filter(gear => !gear.attachedTo)
    .filter(gear => !excludedGear.includes(gear.gearType))

  return (
    <>
      <Typography variant={'h4'}>Other Gear</Typography>
      <GearList gear={otherGear} />
    </>
  )
}
