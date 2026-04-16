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

    <Typography
      variant="h2"
      {...props}
      sx={
        mergeSx(
          {
            textAlign: "center",
            borderBottom: "1px solid",
            borderColor: "secondary.light",
            paddingBottom: 0.5,
          },
          props.sx,
        )
      }
    >
      {children}
    </Typography>

  )
}
