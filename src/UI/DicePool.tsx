import { Box, Paper } from '@material-ui/core'
import { FC } from 'react'

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

export const DicePools: FC = ({
  children,
}) => {
  return <Paper variant="outlined" sx={{ padding: 1, display: 'flex', gap: 1 }}>{children}</Paper>
}

interface DicePoolProps {
  name: string
  groups: DiceGroup[]
  damagePenalty?: number
}

export const DicePool: FC<DicePoolProps> = ({
  name,
  groups,
  damagePenalty = 0,
}) => {
  if (damagePenalty) {
    groups = [...groups, { name: 'Dmg. Penalty', size: damagePenalty * -1 }]
  }

  const total = groups.map(g => g.size || g.default || 0).reduce((a, b) => a + b, 0)

  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column' }}>
      <DiceGroupDisplay name={name} size={total} total />
      {groups.map(group => (
        <DiceGroupDisplay key={group.name} name={group.name} size={group.size || group.default || 0} />
      ))}
    </Box>
  )
}

interface DiceGroupDisplayProps {
  name: string
  size: number
  total?: boolean
}

const DiceGroupDisplay: FC<DiceGroupDisplayProps> = ({
  name,
  size,
  total,
}) => {
  const sizeStyles = { display: 'inline-block', padding: 0.5, width: 30, textAlign: 'center' } as const
  const nameStyles = { display: 'inline-block', padding: 0.5, marginRight: 1 } as const

  return (
    <Box sx={{ display: 'flex', fontSize: total ? 14 : 12, backgroundColor: total ? '#424242' : undefined }}>
      <Box sx={sizeStyles}>{size}</Box>
      <Box sx={nameStyles}>{name}</Box>
    </Box>
  )
}
