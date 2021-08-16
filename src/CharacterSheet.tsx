import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import React, { FC } from 'react'

import { CharacterInfo } from './Character/CharacterInfo'
import { useAllGear, useGearOfType } from './Gear/GearContext'
import { GearType } from './Gear/GearData'
import { GearList } from './Gear/GearList'

export const CharacterSheet: FC = () => {
  const weapons = useGearOfType(GearType.weapon)
    .filter(gear => !gear.attachedTo)
  const drones = useGearOfType(GearType.drone)
  const otherGear = useAllGear()
    .filter(gear => [GearType.other, GearType.rcc].includes(gear.gearType))

  return (
    <Box>
      <Box sx={{ padding: 1 }}>
        <CharacterInfo />
      </Box>
      <Box sx={{ padding: 1 }}>
        <Typography variant={'h4'}>Weapons</Typography>
        <GearList gear={weapons} />
      </Box>
      <Box sx={{ padding: 1 }}>
        <Typography variant={'h4'}>Drones</Typography>
        <GearList gear={drones} />
      </Box>
      <Box sx={{ padding: 1 }}>
        <Typography variant={'h4'}>Other</Typography>
        <GearList gear={otherGear} />
      </Box>
    </Box>
  )
}
