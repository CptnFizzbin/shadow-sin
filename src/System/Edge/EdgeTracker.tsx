import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC, useState } from 'react'

import { TrackCell } from '../../UI/TrackCell'

interface EdgeTrackerProps {
  current: number
}

export const EdgeTracker: FC<EdgeTrackerProps> = ({
  current,
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
    <Box>
      <Typography variant={'h6'}>Edge</Typography>
      <Box sx={{ display: 'flex', textAlign: 'center', gap: 0.5}}>
        <Box sx={{ flexGrow: 0.5 }}>
          <TrackCell onClick={() => setCurValue(0)}>0</TrackCell>
        </Box>
        {new Array(7).fill(null).map((_, index) => (
          <Box key={index} sx={{ flexGrow: 1}}>
            <TrackCell filled={index < curValue} onClick={() => onToggleCell(index + 1)}>
              {index + 1}
            </TrackCell>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
