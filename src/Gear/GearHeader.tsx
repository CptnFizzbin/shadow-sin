import { Chip, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { StatBlock } from '../UI/StatBlock'
import { GearData } from './GearData'
import { AvailabilityStat, CostStat } from './Stats'

interface GearHeaderProps {
  gear: GearData
  type?: string
}

export const GearHeader: FC<GearHeaderProps> = ({
  gear,
  type,
}) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" sx={{display: 'inline-block'}}>{gear.name}</Typography>
        {gear?.quantity && (
          <Chip
            variant="outlined" color="primary" size="small"
            sx={{verticalAlign: 'top', marginLeft: 1}}
            label={`x${gear.quantity}`}
          />
        )}
        <Typography variant="subtitle1">{type || gear.type}</Typography>
      </Box>
      <Box>
        <StatBlock>
          <AvailabilityStat avail={gear.avail} />
          <CostStat cost={gear.cost} />
        </StatBlock>
      </Box>
    </Box>
  )
}
