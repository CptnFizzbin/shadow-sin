import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { Stat, StatBlock } from '../UI/StatBlock'
import { formatAvail, formatCost, GearData } from './GearData'

interface GearAvailCostProps {
  item: GearData
}

export const GearAvailCost: FC<GearAvailCostProps> = ({ item }) => {
  if (!item.avail && !item.cost) return null

  return (
    <Box>
      <StatBlock>
        {item.avail && <Stat name="Avail" value={formatAvail(item.avail)} />}
        {item.cost && <Stat name="Cost" value={formatCost(item.cost)} />}
      </StatBlock>
    </Box>
  )
}
