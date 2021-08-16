import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { Stat, StatBlock } from '../../UI/StatBlock'
import { useAttachedGear } from '../GearContext'
import { GearType } from '../GearData'
import { GearHeader } from '../GearHeader'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { RccData } from './RccData'

interface RccInfoProps {
  rcc: RccData
}

export const RccInfo: FC<RccInfoProps> = ({
  rcc,
}) => {
  const autosofts = useAttachedGear<AutosoftData>(rcc.id, {
    type: GearType.autosoft,
  })

  return (
    <Paper elevation={1}>
      <Box sx={{ padding: 1 }}>
        <GearHeader gear={rcc} />
      </Box>

      <Box sx={{ padding: 1 }}>
        <StatBlock>
          <Stat name="Device Rating" value={rcc.deviceRating} />
          <Stat name="Data Processing" value={rcc.dataProcessing} />
          <Stat name="Firewall" value={rcc.firewall} />
        </StatBlock>
      </Box>

      <Box sx={{ padding: 1 }}>
        <Typography variant={'h6'}>Autosofts</Typography>
        <AutosoftsList autosofts={autosofts} />
      </Box>
    </Paper>
  )
}
