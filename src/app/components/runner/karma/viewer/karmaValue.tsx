// fallow-ignore-file
import Stack from "@mui/material/Stack"
import type { SxProps } from "@mui/material/styles"
import type { FC } from "react"

import { mergeSx } from "#/integrations/mui/muiUtils.ts"

import { KarmaIcon } from "./karmaIcon.tsx"

interface KarmaValueProps {
  amount: number
  sx?: SxProps
}

export const KarmaValue: FC<KarmaValueProps> = ({
  amount,
  sx,
}) => {
  return (
    <Stack direction="row" sx={mergeSx({ alignItems: "center", gap: 0.5 }, sx)}>
      {amount} <KarmaIcon size={12} />
    </Stack>
  )
}
