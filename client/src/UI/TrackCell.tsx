import Paper from '@material-ui/core/Paper'
import { FC, useState } from 'react'

import { noOp } from '../Helpers'

interface TrackCellProps {
  onClick? (): void

  filled?: boolean
}

export const TrackCell: FC<TrackCellProps> = ({
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
