import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { DicePools } from '../../../UI/DicePool'
import { StatBlock } from '../../../UI/StatBlock'
import { useGear } from '../../GearContext'
import { GearType } from '../../GearData'
import { GearHeader } from '../../GearHeader'
import { AttackRatingStat, DamageValueStat } from '../Stats'
import { WeaponData } from '../WeaponData'
import { BasicAttackPool, DroneAttackPool, RiggedAttackPool, VehicleAttackPool } from './DicePools'
import { AmmoStat, FirearmModeStat } from './Stats'

interface FirearmProps {
  firearm: WeaponData
}

export const FirearmInfo: FC<FirearmProps> = ({
  firearm,
}) => {
  const mounted = useGear(firearm.attachedTo)?.gearType === GearType.vehicleMod

  return (
    <Paper>
      <GearHeader gear={firearm} />

      <Box sx={{ padding: 1 }}>
        <StatBlock>
          <DamageValueStat dv={firearm.dv} />
          <FirearmModeStat modes={firearm.modes || null} />
          <AttackRatingStat ratings={firearm.attackRatings} />
          <AmmoStat ammo={firearm.ammo || null} />
        </StatBlock>
      </Box>

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
