import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { StatBlock } from '../../../UI/StatBlock'
import { GearHeader } from '../../GearHeader'
import { AttackRatingStat, DamageValueStat } from '../Stats'
import { WeaponData } from '../WeaponData'
import { AmmoStat, FirearmModeStat } from './Stats'

interface FirearmProps {
  firearm: WeaponData
}

export const FirearmInfo: FC<FirearmProps> = ({
  firearm,
}) => {
  return (
    <Paper>
      <Box sx={{ padding: 1 }}>
        <GearHeader gear={firearm} />
        <div>
          <StatBlock>
            <DamageValueStat dv={firearm.dv} />
            <FirearmModeStat modes={firearm.modes || null} />
            <AttackRatingStat ratings={firearm.attackRatings} />
            <AmmoStat ammo={firearm.ammo || null} />
          </StatBlock>
        </div>
      </Box>
    </Paper>
  )
}
