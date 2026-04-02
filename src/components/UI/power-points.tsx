import type { TypographyProps } from "@mui/material/Typography"
import Typography from "@mui/material/Typography"
import { green } from "@mui/material/colors"
import type { SxProps, Theme } from "@mui/material/styles"
import type { FC } from "react"

import { mergeSx } from "#/integrations/mui/mui-utils.ts"

interface PowerPointsProps {
  value: number
  total?: number
  variant?: TypographyProps["variant"]
  sx?: SxProps<Theme>
}

export const PowerPoints: FC<PowerPointsProps> = ({
  value,
  total,
  variant,
  sx,
}) => {
  const displayText =
    total !== undefined ? `${value} / ${total} PP` : `${value} PP`

  return (
    <Typography variant={variant} sx={mergeSx({ color: green[700] }, sx)}>
      {displayText}
    </Typography>
  )
}
