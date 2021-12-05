import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { FC } from 'react'

import { noOp } from '../../Helpers'
import { TrackCell } from '../../UI/TrackCell'
import { useDamage, useSetDamage } from './DamageProvider'
import { DamageType } from './DamageType'

import styles from './DamageTrack.module.scss'

interface DamageTrackProps {
  type: DamageType
  max: number
  label?: string
}

export const DamageTrack: FC<DamageTrackProps> = ({
  type,
  max,
  label = 'Physical',
}) => {
  const current = useDamage(type)
  const onChange = useSetDamage(type)

  const onToggleCell = (value: number) => {
    if (value === current) {
      onChange(value - 1)
    } else {
      onChange(value)
    }
  }

  const numCells = Math.max(max, current + 1)

  return (
    <Box sx={{ minWidth: 150, maxWidth: 300 }}>
      <Typography variant={'h6'}>{label}</Typography>
      <Box sx={{ paddingBottom: 0.5, textAlign: 'right' }}>
        <TrackCell onClick={() => onChange(0)}>0</TrackCell>
      </Box>
      <Box className={styles.DamageTrack}>
        {new Array(numCells).fill(null).map((_, index) => (
          <DamageCell
            key={index}
            value={index + 1}
            filled={index < current}
            toggleCell={onToggleCell}
            isOverflow={index >= max}
          />
        ))}
      </Box>
    </Box>
  )
}

interface DamageCellProps {
  value: number
  filled?: boolean
  isOverflow?: boolean

  toggleCell? (newValue: number): void
}

const DamageCell: FC<DamageCellProps> = ({
  value,
  filled = false,
  isOverflow = false,
  toggleCell = noOp,
}) => {
  const penalty = Math.floor((value + 1) / 3)

  return (
    <TrackCell onClick={() => toggleCell(value)} filled={filled} isOverflow={isOverflow}>
      <Box sx={{ textAlign: 'right' }}>
        {value % 3 === 0 ? penalty * -1 : '\u00A0'}
      </Box>
    </TrackCell>
  )
}
