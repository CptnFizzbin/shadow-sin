import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SinsList } from "#/components/Character/Form/Gear/Licenses/SinsList.tsx"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"




interface SinsAndLicensesSectionProps {
  form: PlayerCharacterForm
}

export const SinsAndLicensesSection: FC<SinsAndLicensesSectionProps> = ({
  form,
}) => {
  return (
    <Stack gap={1}>
      <SinsList form={form} />
    </Stack>
  )
}
