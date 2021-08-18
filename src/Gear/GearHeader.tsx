import { Chip, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'

import { StatBlock } from '../UI/StatBlock'
import { GearInfoBlock } from './GearInfo'
import { AvailabilityStat, CostStat } from './Stats'

export const GearHeader: GearInfoBlock<{ type?: string }> = ({
  item,
  type,
}) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ padding: 1, flexGrow: 1 }}>
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

      <Box sx={{ padding: 1 }}>
        <StatBlock>
          <AvailabilityStat avail={item.avail} />
          <CostStat cost={item.cost} />
        </StatBlock>
      </Box>
    </Box>
  )
}
