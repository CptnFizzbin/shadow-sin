import Paper from '@mui/material/Paper'
import { FC, useState } from 'react'

import { noOp } from '../Helpers'

interface TrackCellProps {
  onClick? (): void

  filled?: boolean
  isOverflow?: boolean
}

export const TrackCell: FC<TrackCellProps> = ({
  children,
  onClick = noOp,
  filled = false,
  isOverflow = false,
}) => {
  const [hovered, setHovered] = useState<boolean>(false)

  let backgroundColor = 'default'
  if (filled) backgroundColor = 'primary.dark'
  if (hovered) backgroundColor = 'primary.light'

  let borderColor = undefined
  if (isOverflow) borderColor = 'red'

  return (
    <Paper
      sx={{ padding: 1, userSelect: 'none', backgroundColor, borderColor }}
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
