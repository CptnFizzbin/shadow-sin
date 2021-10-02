import Box from '@mui/material/Box'
import { FC } from 'react'

import { GearData } from './GearData'
import { GearInfo } from './GearInfo'

interface GearListProps {
  gear: GearData[]
  expanded?: boolean
}

export const GearList: FC<GearListProps> = ({
  gear,
  expanded = true,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {gear.map((gear) => <GearInfo key={gear.id} item={gear} expanded={expanded} />)}
    </Box>
  )
}
