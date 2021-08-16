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
  const vehicles = useGearOfType(GearType.vehicle)
  const otherGear = useAllGear()
    .filter(gear => !gear.attachedTo)
    .filter(gear => {
      const excludedGear = [
        GearType.weapon,
        GearType.drone,
        GearType.vehicle,
      ]

      return !excludedGear.includes(gear.gearType)
    })

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
        <Typography variant={'h4'}>Vehicles</Typography>
        <GearList gear={vehicles} />
      </Box>

      <Box sx={{ padding: 1 }}>
        <Typography variant={'h4'}>Other</Typography>
        <GearList gear={otherGear} />
      </Box>
    </Box>
  )
}
