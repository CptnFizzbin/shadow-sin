import { Typography } from '@material-ui/core'
import React, { FC } from 'react'

import { useAllGear } from '../../../Gear/GearContext'
import { GearType } from '../../../Gear/GearData'
import { GearList } from '../../../Gear/GearList'

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
