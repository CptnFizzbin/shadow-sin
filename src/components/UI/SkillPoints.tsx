import type { TypographyProps } from "@mui/material/Typography"
import Typography from "@mui/material/Typography"
import { yellow } from "@mui/material/colors"
import type { SxProps, Theme } from "@mui/material/styles"
import type { FC } from "react"

import { mergeSx } from "#/integrations/mui/MuiUtils.ts"

interface SkillPointsProps {
  value: number
  variant?: TypographyProps["variant"]
  sx?: SxProps<Theme>
}

export const SkillPoints: FC<SkillPointsProps> = ({ value, variant, sx }) => {
  return (
    <Typography variant={variant} sx={mergeSx({ color: yellow[700] }, sx)}>
      {value} SP
    </Typography>
  )
}
