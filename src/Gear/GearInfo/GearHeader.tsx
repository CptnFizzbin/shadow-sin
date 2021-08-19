import { Chip, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { InfoSection } from '../../UI/InfoBlock/InfoSection'
import { StatBlock } from '../../UI/StatBlock'
import { AvailabilityStat, CostStat } from '../Stats'
import { GearInfoSectionProps } from './GearInfoSectionProps'

export const GearHeader: FC<GearInfoSectionProps & { type?: string }> = ({
  item,
  type,
}) => {
  return (
    <InfoSection>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ display: 'inline-block', color: 'primary.main' }}>{item.name}</Typography>
          {item?.quantity && (
            <Chip
              variant="outlined" color="primary" size="small"
              sx={{ verticalAlign: 'top', marginLeft: 1 }}
              label={`x${item.quantity}`}
            />
          )}
          <Typography variant="subtitle1">{type || item.type}</Typography>
        </Box>

        <Box>
          <StatBlock>
            <AvailabilityStat avail={item.avail} />
            <CostStat cost={item.cost} />
          </StatBlock>
        </Box>
      </Box>
    </InfoSection>
  )
}
