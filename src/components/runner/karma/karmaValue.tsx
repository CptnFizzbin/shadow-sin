// fallow-ignore-file
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { KarmaIcon } from "./karmaIcon.tsx"

interface KarmaValueProps {
  amount: number
}

export const KarmaValue: FC<KarmaValueProps> = ({
  amount,
}) => {
  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
      {amount} <KarmaIcon size={12} />
    </Stack>
  )
}
