import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SinsList } from "#/components/CharacterBuilder/Sections/Gear/Licenses/SinsList.tsx"

export const SinsAndLicensesSection: FC = () => {
  return (
    <Stack gap={1}>
      <SinsList />
    </Stack>
  )
}
