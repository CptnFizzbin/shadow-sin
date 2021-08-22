import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { noOp } from '../../Helpers'
import { TrackCell } from '../../UI/TrackCell'

import styles from './DamageTrack.module.scss'

interface DamageTrackProps {
  current: number
  max: number
  label?: string

  onChange (value: number): void
}

export const DamageTrack: FC<DamageTrackProps> = ({
  current,
  max,
  label = 'Physical',
  onChange,
}) => {
  const onToggleCell = (value: number) => {
    if (value === current) {
      onChange(value - 1)
    } else {
      onChange(value)
    }
  }

  return (
    <Box sx={{ maxWidth: 300 }}>
      <Typography variant={'h6'}>{label}</Typography>
      <Box sx={{ paddingBottom: 0.5, textAlign: 'right' }}>
        <TrackCell onClick={() => onChange(0)}>0</TrackCell>
      </Box>
      <Box className={styles.DamageTrack}>
        {new Array(max).fill(null).map((_, index) => (
          <DamageCell key={index} value={index + 1} filled={index < current} toggleCell={onToggleCell} />
        ))}
      </Box>
    </Box>
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
    <TrackCell onClick={() => toggleCell(value)} filled={filled}>
      <Box sx={{ textAlign: 'right' }}>
        {value % 3 === 0 ? penalty * -1 : '\u00A0'}
      </Box>
    </TrackCell>
  )
}
