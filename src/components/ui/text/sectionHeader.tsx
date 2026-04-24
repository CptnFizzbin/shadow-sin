import Paper from "@mui/material/Paper"
import type { TypographyProps } from "@mui/material/Typography"
import Typography from "@mui/material/Typography"
import type { FC, PropsWithChildren } from "react"

import { mergeSx } from "#/integrations/mui/muiUtils.ts"

interface SectionHeaderProps extends PropsWithChildren, TypographyProps {}

export const SectionHeader: FC<SectionHeaderProps> = ({
  children,
  ...props
}) => {
  return (
    <Paper sx={{ marginX: -1, padding: 2 }} variant="elevation">
      <Typography
        variant="h2"
        {...props}
        sx={
          mergeSx(
            { textAlign: "center" },
            props.sx,
          )
        }
      >
        {children}
      </Typography>
    </Paper>
  )
}
