import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { toTitleCase } from '../Helpers'
import { Stat, StatBlock } from '../UI/StatBlock'
import { useAttachedGear } from './GearContext'
import { GearData } from './GearData'
import { GearHeader } from './GearHeader'
import { NestedGear } from './NestedGear'

interface OtherGearInfoProps {
  gear: GearData
}

export const DefaultGearInfo: FC<OtherGearInfoProps> = ({
  gear,
}) => {
  const attachedGear = useAttachedGear(gear.id)

  return (
    <Paper elevation={1}>
      <GearHeader gear={gear} />

      {gear.stats && (
        <Box sx={{ padding: 1 }}>
          <StatBlock>
            {Object.entries(gear.stats).map(([name, value]) => (
              <Stat key={name} name={toTitleCase(name)} value={value} />
            ))}
          </StatBlock>
        </Box>
      )}

      <NestedGear gear={attachedGear} />
    </Paper>
  )
}
