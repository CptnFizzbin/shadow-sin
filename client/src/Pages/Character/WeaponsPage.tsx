import { Typography } from '@mui/material'
import React, { FC } from 'react'

import { useGearOfType } from '../../Gear/GearContext'
import { GearType } from '../../Gear/GearData'
import { GearList } from '../../Gear/GearList'
import { WeaponData } from '../../Gear/Weapons/WeaponData'

export const WeaponsPage: FC = () => {
  const weapons = useGearOfType<WeaponData>(GearType.weapon)
    .filter(gear => !gear.attachedTo)

  return (
    <>
      <Typography variant={'h4'}>Weapons</Typography>
      <GearList gear={weapons} />
    </>
  )
}
