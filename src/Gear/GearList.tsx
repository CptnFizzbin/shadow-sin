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
    <>
      {gear.map((gear, index) => (
        <Box key={gear.id} sx={{ paddingTop: index === 0 ? 0 : 1 }}>
          <GearInfo item={gear} />
        </Box>
      ))}
    </>
  )
}
