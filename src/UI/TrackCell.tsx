import Paper from "@mui/material/Paper"
import { FC, useState } from "react"

interface TrackCellProps {
  onClick?(): void

  filled?: boolean
  isOverflow?: boolean
  className?: string
}

export const TrackCell: FC<TrackCellProps> = ({
  children,
  onClick,
  filled = false,
  isOverflow = false,
  className,
}) => {
  const [hovered, setHovered] = useState<boolean>(false)

  let backgroundColor = "default"
  if (filled) backgroundColor = "primary.dark"
  if (onClick && hovered) backgroundColor = "primary.light"

  let borderColor = undefined
  if (isOverflow) borderColor = "red"

  return (
    <Paper
      sx={{ padding: 1, userSelect: "none", backgroundColor, borderColor }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setHovered(false)
        onClick && onClick()
      }}
      variant={"outlined"}
      className={className}
    >
      {children}
    </Paper>
  )
}
