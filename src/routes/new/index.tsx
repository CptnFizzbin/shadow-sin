import Box from "@mui/material/Box"
import { createFileRoute } from "@tanstack/react-router"

import { CharacterBuilder } from "#/components/CharacterBuilder/character-builder.tsx"

export const Route = createFileRoute("/new/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box sx={{ padding: 1 }}>
      <CharacterBuilder />
    </Box>
  )
}
