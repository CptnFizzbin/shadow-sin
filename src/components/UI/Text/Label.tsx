import Typography from "@mui/material/Typography"
import type { SxProps } from "@mui/material/styles"
import type { FC, ReactNode } from "react"

import { mergeSx } from "#/integrations/mui/MuiUtils.ts"

interface LabelProps {
  label: ReactNode
  variant?: "contained" | "outlined" | "text"
  textAlign?: "center" | "left" | "right"
  color?: string
  textColor?: string
  sx?: SxProps
}

export const Label: FC<LabelProps> = ({
  label,
  textAlign = "center",
  variant = "contained",
  color = "secondary.dark",
  textColor,
  sx,
}) => {
  let styles: SxProps

  switch (variant) {
    case "contained":
      styles = {
        backgroundColor: color,
        color: textColor || "common.white",
      }
      break
    case "outlined":
      styles = {
        border: "1px solid",
        borderColor: color,
        color: color,
      }
      break
    case "text":
    default:
      styles = {
        color: textColor || color,
      }
      break
  }

  return (
    <Typography
      variant="caption"
      sx={mergeSx(sx, { display: "block", width: "100%" }, styles, { textAlign })}
    >
      {label}
    </Typography>
  )
}
