import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { useGear } from '../../GearContext'
import { GearType } from '../../GearData'
import { GearAttributes } from '../../GearInfo/GearAttributes'
import { GearDicePools } from '../../GearInfo/GearDicePools'
import { GearHeader } from '../../GearInfo/GearHeader'
import { WeaponAttrNames, WeaponData } from '../WeaponData'
import { BasicAttackPool, DroneAttackPool, RiggedAttackPool, VehicleAttackPool } from './DicePools'

interface FirearmProps {
  firearm: WeaponData
}

export const FirearmInfo: FC<FirearmProps> = ({
  firearm,
}) => {
  const mounted = useGear(firearm.attachedTo)?.gearType === GearType.vehicleMod

  return (
    <Paper>
      <GearHeader item={firearm} />
      <GearAttributes item={firearm} attrNames={WeaponAttrNames} />
      <GearDicePools>
        {mounted ? (
          <>
            <VehicleAttackPool weapon={firearm} />
            <DroneAttackPool weapon={firearm} />
            <RiggedAttackPool weapon={firearm} />
          </>
        ) : (
          <>
            <BasicAttackPool weapon={firearm} />
          </>
        )}
      </GearDicePools>
    </Paper>
  )
}
