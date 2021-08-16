import { Paper } from '@material-ui/core'
import React, { FC } from 'react'

import { GearData } from './GearData'
import { GearList } from './GearList'

interface NestedGearProps {
  gear: GearData[]
}

export const NestedGear: FC<NestedGearProps> = ({
  gear,
}) => {
  if (gear.length === 0) return null

  return (
    <Paper variant="outlined" sx={{ padding: 1 }}>
      <GearList gear={gear} />
    </Paper>
  )
}
