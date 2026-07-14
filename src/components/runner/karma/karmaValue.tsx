// fallow-ignore-file
import Stack from "@mui/material/Stack"
import type { SxProps, Theme } from "@mui/material/styles"
import type { FC } from "react"

import { KarmaIcon } from "./karmaIcon.tsx"

interface KarmaValueProps {
  amount: number
  sx?: SxProps<Theme>
}

export const KarmaValue: FC<KarmaValueProps> = ({
  amount,
  sx,
}) => {
  return (
    <Stack direction="row" sx={[{ alignItems: "center", gap: 0.5 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {amount} <KarmaIcon size={12} />
    </Stack>
  )
}
