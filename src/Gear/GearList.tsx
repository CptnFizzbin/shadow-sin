import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { GearData } from './GearData'
import { GearInfo } from './GearInfo'

interface GearListProps {
  gear: GearData[]
}

export const GearList: FC<GearListProps> = ({
  gear,
}) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {gear.map((gear) => (
        <Box key={gear.id} sx={{ flexGrow: 1 }}>
          <GearInfo item={gear} />
        </Box>
      ))}
    </Box>
  )
}
