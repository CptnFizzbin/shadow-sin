import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { EquippedWeaponsSection } from "#/components/offense/equippedWeaponsSection.tsx"
import { InitiativeSection } from "#/components/offense/initiativeSection.tsx"

export const OffensePage: FC = () => {
  return (
    <Stack gap={2}>
      <InitiativeSection />
      <Divider />
      <EquippedWeaponsSection />
    </Stack>
  )
}
