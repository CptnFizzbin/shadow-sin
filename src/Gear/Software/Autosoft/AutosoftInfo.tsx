import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { Stat, StatBlock } from '../../../UI/StatBlock'
import { GearHeader } from '../../GearHeader'
import { AutosoftData } from './AutosoftData'

interface AutosoftInfoProps {
  autosoft: AutosoftData
}

export const AutosoftInfo: FC<AutosoftInfoProps> = ({
  autosoft,
}) => {
  return (
    <Paper elevation={1}>
      <Box sx={{ padding: 1 }}>
        <GearHeader gear={autosoft} />
        <StatBlock>
          <Stat name="Rating" value={autosoft.rating} />
          {autosoft.skill && <Stat name="Skill" value={autosoft.skill} />}
          {autosoft.weapon && <Stat name="Weapon" value={autosoft.weapon} />}
          <Stat name="Attr" value={autosoft.attr} />
        </StatBlock>
      </Box>
    </Paper>
  )
}
