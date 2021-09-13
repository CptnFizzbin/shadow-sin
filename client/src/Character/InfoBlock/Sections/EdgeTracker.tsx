import { Chip, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC, useState } from 'react'

import { useAttribute } from '../../../System/AttributeProvider'
import { InfoSection } from '../../../UI/InfoBlock/InfoSection'
import { TrackCell } from '../../../UI/TrackCell'
import { CharacterAttr } from '../../CharacterAttr'

export const EdgeTracker: FC = () => {
  const edgeSessionKey = 'char.edge'
  const charEdgeAttr = useAttribute<number>(CharacterAttr.edge) || 0
  const defaultEdge = parseInt(localStorage.getItem(edgeSessionKey) || charEdgeAttr.toString())

  const [curValue, setCurValue] = useState<number>(defaultEdge)
  const setEdge = (value: number) => {
    setCurValue(value)
    localStorage.setItem(edgeSessionKey, value.toString())
  }

  const onToggleCell = (value: number) => {
    if (value === curValue) {
      setEdge(value - 1)
    } else {
      setEdge(value)
    }
  }

  const onReset = () => {
    setEdge(charEdgeAttr)
  }

  return (
    <InfoSection>
      <Box>
        <Typography variant="h6" sx={{ display: 'inline', marginRight: 1 }}>Edge</Typography>
        <Chip onClick={onReset} label="Reset" size="small" variant="outlined" sx={{ verticalAlign: 'text-bottom' }} />
      </Box>
      <Box sx={{ display: 'flex', textAlign: 'center', gap: 0.5 }}>
        <Box sx={{ flexGrow: 0.5 }}>
          <TrackCell onClick={() => setEdge(0)}>0</TrackCell>
        </Box>
        {new Array(7).fill(null).map((_, index) => (
          <Box key={index} sx={{ flexGrow: 1 }}>
            <TrackCell filled={index < curValue} onClick={() => onToggleCell(index + 1)}>
              {index + 1}
            </TrackCell>
          </Box>
        ))}
      </Box>
    </InfoSection>
  )
}
