import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import { FC, useState } from 'react'

import { noOp } from '../Helpers'

import styles from './DamageTrack.module.scss'

interface DamageTrackProps {
  current: number
  max: number
  label?: string
}

export const DamageTrack: FC<DamageTrackProps> = ({
  current,
  max,
  label = 'Physical',
}) => {
  const [curValue, setCurValue] = useState<number>(current)

  const onToggleCell = (value: number) => {
    if (value === curValue) {
      setCurValue(value - 1)
    } else {
      setCurValue(value)
    }
  }

  return (
    <Box sx={{ maxWidth: 300 }}>
      <Typography variant={'h6'}>{label}</Typography>
      <Box sx={{ paddingBottom: 0.5 }}>
        <TrackButton onClick={() => setCurValue(0)}>Clear</TrackButton>
      </Box>
      <Box className={styles.DamageTrack}>
        {new Array(max).fill(null).map((_, index) => (
          <DamageCell key={index} value={index + 1} filled={index < curValue} toggleCell={onToggleCell} />
        ))}
      </Box>
    </Box>
  )
}

interface TrackButtonProps {
  onClick? (): void

  filled?: boolean
}

const TrackButton: FC<TrackButtonProps> = ({
  children,
  onClick = noOp,
  filled = false,
}) => {
  const [hovered, setHovered] = useState<boolean>(false)

  let backgroundColor = 'default'
  if (filled) backgroundColor = 'primary.dark'
  if (hovered) backgroundColor = 'primary.light'

  return (
    <Paper
      sx={{ padding: 1, userSelect: 'none', backgroundColor }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setHovered(false)
        onClick()
      }}
      variant={'outlined'}
    >{children}</Paper>
  )
}

interface DamageCellProps {
  value: number
  filled?: boolean

  toggleCell? (newValue: number): void
}

const DamageCell: FC<DamageCellProps> = ({
  value,
  filled = false,
  toggleCell = noOp,
}) => {
  const penalty = Math.floor((value + 1) / 3)

  return (
    <TrackButton onClick={() => toggleCell(value)} filled={filled}>
      <Box sx={{ textAlign: 'right' }}>
        {value % 3 === 0 ? penalty * -1 : '\u00A0'}
      </Box>
    </TrackButton>
  )
}
