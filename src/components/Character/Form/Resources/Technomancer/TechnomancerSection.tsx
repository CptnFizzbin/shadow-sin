import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { ComplexFormsFormGroup } from "#/components/Character/Form/Resources/Technomancer/ComplexFormsFormGroup.tsx"
import { SpritesFormGroup } from "#/components/Character/Form/Resources/Technomancer/SpritesFormGroup.tsx"

export const TechnomancerSection: FC = () => {
  return (
    <Paper sx={{ padding: 1 }}>
      <Stack gap={1}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Technomancer
        </Typography>

        <ComplexFormsFormGroup />
        <Divider />
        <SpritesFormGroup />
      </Stack>
    </Paper>
  )
}
