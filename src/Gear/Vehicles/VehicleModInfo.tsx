import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { useAttachedGear } from '../GearContext'
import { GearType } from '../GearData'
import { GearHeader } from '../GearHeader'
import { WeaponData } from '../Weapons/WeaponData'
import { WeaponList } from '../Weapons/WeaponList'
import { VehicleModData } from './VehicleModData'

interface VehicleModInfoProps {
  mod: VehicleModData
}

export const VehicleModInfo: FC<VehicleModInfoProps> = ({
  mod,
}) => {
  const attachedWeapons = useAttachedGear(mod.id)
    .filter(gear => gear.gearType === GearType.weapon)
    .map(gear => gear as WeaponData)

  return (
    <Paper elevation={1}>
      <Box sx={{ padding: 1 }}>
        <GearHeader gear={mod} />
        <Box sx={{ paddingTop: 1 }}>
          <Paper variant="outlined">
            <WeaponList weapons={attachedWeapons} />
          </Paper>
        </Box>
      </Box>
    </Paper>
  )
}
