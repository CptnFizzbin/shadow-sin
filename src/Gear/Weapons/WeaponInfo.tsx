import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { GearAttributes } from '../GearAttributes'
import { useGear } from '../GearContext'
import { GearType } from '../GearData'
import { GearDicePools } from '../GearDicePools'
import { GearHeader } from '../GearHeader'
import { BasicAttackPool, DroneAttackPool, RiggedAttackPool, VehicleAttackPool } from './DicePools'
import { WeaponData } from './WeaponData'

interface FirearmProps {
  weapon: WeaponData
}

export const WeaponInfo: FC<FirearmProps> = ({
  weapon,
}) => {
  const mounted = useGear(weapon.attachedTo)?.gearType === GearType.vehicleMod

  return (
    <Paper>
      <GearHeader item={weapon} />
      <GearAttributes item={weapon} />
      <GearDicePools>
        {mounted ? (
          <>
            <VehicleAttackPool weapon={weapon} />
            <DroneAttackPool weapon={weapon} />
            <RiggedAttackPool weapon={weapon} />
          </>
        ) : (
          <>
            <BasicAttackPool weapon={weapon} />
          </>
        )}
      </GearDicePools>
    </Paper>
  )
}
