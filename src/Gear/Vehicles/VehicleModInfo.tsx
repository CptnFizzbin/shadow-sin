import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { useAttachedGear } from '../GearContext'
import { GearType } from '../GearData'
import { GearHeader } from '../GearHeader'
import { NestedGear } from '../NestedGear'
import { WeaponData } from '../Weapons/WeaponData'
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
      <GearHeader gear={mod} />

      <NestedGear gear={attachedWeapons} />
    </Paper>
  )
}
