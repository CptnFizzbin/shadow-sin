import { Avatar, Box, Chip, Paper } from '@material-ui/core'
import { FC } from 'react'

import { toTitleCase } from '../Helpers'

export const toDiceGroup = (input: DiceGroupLike): DiceGroup => {
  return {
    name: input.name,
    size: input.size || input.rank || input.value || 0,
  }
}

export interface DiceGroupLike {
  name: string
  size?: number
  rank?: number
  value?: number
}

export interface DiceGroup {
  name: string
  size: number | undefined
  default?: number
}

interface DicePoolProps {
  name: string
  groups: DiceGroup[]
}

export const DicePools: FC = ({
  children,
}) => {
  return <Paper variant="outlined" sx={{ padding: 1, display: 'flex'}}>{children}</Paper>
}

export const DicePool: FC<DicePoolProps> = ({
  name,
  groups,
}) => {
  const total = groups.map(g => g.size || g.default || 0).reduce((a, b) => a + b, 0)

  return (
    <Paper sx={{ display: 'inline-flex', padding: 1, flexDirection: 'column' }}>
      <Box sx={{ padding: 0.5 }}>
        <DiceGroupDisplay name={name} size={total} />
      </Box>
      {groups.map(group => (
        <Box key={group.name} sx={{ padding: 0.5 }}>
          <DiceGroupDisplay name={group.name} size={group.size || group.default || 0} outlined small />
        </Box>
      ))}
    </Paper>
  )
}

interface DiceGroupDisplayProps {
  name: string
  size: number
  outlined?: boolean
  small?: boolean
}

const DiceGroupDisplay: FC<DiceGroupDisplayProps> = ({
  name,
  size,
  outlined = false,
  small,
}) => {
  return (
    <Chip
      avatar={<Avatar>{size}</Avatar>}
      label={toTitleCase(name)}
      variant={outlined ? 'outlined' : undefined}
      size={small ? 'small' : undefined}
    />
  )
}
