import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SinsList } from "#/components/characterBuilder/sections/gear/licenses/sinsList.tsx"

export const SinsAndLicensesSection: FC = () => {
  return (
    <Stack gap={1}>
      <SinsList />
    </Stack>
  )
}
