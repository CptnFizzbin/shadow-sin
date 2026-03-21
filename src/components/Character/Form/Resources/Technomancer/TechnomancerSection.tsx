import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ComplexFormsFormGroup } from "#/components/Character/Form/Resources/Technomancer/ComplexFormsFormGroup.tsx"
import { SpritesFormGroup } from "#/components/Character/Form/Resources/Technomancer/SpritesFormGroup.tsx"

export const TechnomancerSection: FC = () => {
  return (
    <Stack gap={2}>
      <ComplexFormsFormGroup />
      <Divider />
      <SpritesFormGroup />
    </Stack>
  )
}
