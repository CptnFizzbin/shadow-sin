import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC, useState } from 'react'

import { CharacterAttr } from '../../Character/CharacterData'
import { TrackCell } from '../../UI/TrackCell'
import { useAttribute } from '../AttributeProvider'

export const EdgeTracker: FC = () => {
  const edgeSessionKey = 'char.edge'
  const charEdgeAttr = useAttribute<number>(CharacterAttr.edge) || 0
  const defaultEdge = parseInt(localStorage.getItem(edgeSessionKey) || charEdgeAttr.toString())

  const [curValue, setCurValue] = useState<number>(defaultEdge)
  const onEdgeChange = (value: number) => {
    setCurValue(value)
    localStorage.setItem(edgeSessionKey, value.toString())
  }

  console.log(curValue)

  const onToggleCell = (value: number) => {
    if (value === curValue) {
      onEdgeChange(value - 1)
    } else {
      onEdgeChange(value)
    }
  }

  return (
    <Box>
      <Typography variant={'h6'}>Edge</Typography>
      <Box sx={{ display: 'flex', textAlign: 'center', gap: 0.5 }}>
        <Box sx={{ flexGrow: 0.5 }}>
          <TrackCell onClick={() => onEdgeChange(0)}>0</TrackCell>
        </Box>
        {new Array(7).fill(null).map((_, index) => (
          <Box key={index} sx={{ flexGrow: 1 }}>
            <TrackCell filled={index < curValue} onClick={() => onToggleCell(index + 1)}>
              {index + 1}
            </TrackCell>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
