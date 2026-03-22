import type { TypographyProps } from "@mui/material/Typography"
import Typography from "@mui/material/Typography"
import { lightBlue } from "@mui/material/colors"
import type { SxProps, Theme } from "@mui/material/styles"
import type { FC } from "react"

import { mergeSx } from "#/integrations/mui/MuiUtils.ts"

interface BuildPointsProps {
  value: number
  total?: number
  variant?: TypographyProps["variant"]
  sx?: SxProps<Theme>
  error?: boolean
}

export const BuildPoints: FC<BuildPointsProps> = ({
  value,
  total,
  variant,
  sx,
  error = false,
}) => {
  const displayText =
    total !== undefined ? `${value} / ${total} BP` : `${value} BP`

  return (
    <Typography
      variant={variant}
      sx={mergeSx({ color: error ? "error.main" : lightBlue[700] }, sx)}
    >
      {displayText}
    </Typography>
  )
}
