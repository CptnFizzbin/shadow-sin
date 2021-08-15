import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { toTitleCase } from '../Helpers'
import { Stat, StatBlock } from '../UI/StatBlock'
import { useAttachedGear } from './GearContext'
import { GearData } from './GearData'
import { GearHeader } from './GearHeader'
import { GearInfo } from './GearInfo'

interface OtherGearInfoProps {
  gear: GearData
}

export const OtherGearInfo: FC<OtherGearInfoProps> = ({
  gear,
}) => {
  const attachedGear = useAttachedGear(gear.id)

  return (
    <Paper elevation={1}>
      <Box sx={{ padding: 1 }}>
        <GearHeader gear={gear} />
        {gear.stats && (
          <StatBlock>
            {Object.entries(gear.stats).map(([name, value]) => (
              <Stat key={name} name={toTitleCase(name)} value={value} />
            ))}
          </StatBlock>
        )}
        <Box sx={{ paddingTop: 1 }}>
          <Paper variant="outlined">
            {attachedGear.map(child => <GearInfo key={child.id} gear={child} />)}
          </Paper>
        </Box>
      </Box>
    </Paper>
  )
}
