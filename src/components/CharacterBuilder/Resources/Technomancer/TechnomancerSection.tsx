import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { ComplexFormsList } from "#/components/CharacterBuilder/Resources/Technomancer/ComplexFormsList.tsx"
import { SpritesList } from "#/components/CharacterBuilder/Resources/Technomancer/SpritesList.tsx"

export const TechnomancerSection: FC = () => {
  return (
    <Paper sx={{ padding: 1 }}>
      <Stack gap={1}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Technomancer
        </Typography>

        <ComplexFormsList />
        <Divider />
        <SpritesList />
      </Stack>
    </Paper>
  )
}
