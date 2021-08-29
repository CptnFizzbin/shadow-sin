import { Typography } from '@material-ui/core'
import React, { FC } from 'react'

import { useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearList } from '../GearList'
import { WeaponData } from './WeaponData'

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
