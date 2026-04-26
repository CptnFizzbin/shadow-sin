import Chip from "@mui/material/Chip"
import type { FC } from "react"

interface DiceFaceProps {
  value: number
}

export const DiceFace: FC<DiceFaceProps> = ({ value }) => {
  const isHit = value >= 5
  const isOne = value === 1

  const color = isHit ? "secondary" : isOne ? "error" : "default"
  const variant = isHit || isOne ? "filled" : "outlined"

  return (
    <Chip
      label={value}
      size="small"
      variant={variant}
      color={color}
      sx={{ height: 24, minWidth: 28, fontSize: "0.8rem", fontWeight: isHit || isOne ? 700 : 400 }}
    />
  )
}
