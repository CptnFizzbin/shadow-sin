import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { DicePools } from '../../../UI/DicePool'
import { GearAttributes } from '../../GearAttributes'
import { useGear } from '../../GearContext'
import { GearType } from '../../GearData'
import { GearHeader } from '../../GearHeader'
import { WeaponData } from '../WeaponData'
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
      <GearAttributes item={firearm} />

      <Box sx={{ padding: 1 }}>
        <DicePools>
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
        </DicePools>
      </Box>
    </Paper>
  )
}
