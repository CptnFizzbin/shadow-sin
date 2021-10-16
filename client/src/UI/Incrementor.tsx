import { Add, Remove } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { FC } from 'react'

interface IncrementorProps {
  min?: number
  max?: number
  value: number

  onChange (value: number): void
}

export const Incrementor: FC<IncrementorProps> = ({
  min = -Infinity,
  max = Infinity,
  value,
  onChange,
}) => {
  return (
    <Box>
      <IconButton aria-label="delete" size="small" onClick={() => onChange(Math.max(value - 1, min))}>
        <Remove fontSize="inherit" />
      </IconButton>
      {value}
      <IconButton aria-label="delete" size="small" onClick={() => onChange(Math.min(value + 1, max))}>
        <Add fontSize="inherit" />
      </IconButton>
    </Box>
  )
}
