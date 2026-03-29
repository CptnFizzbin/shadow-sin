import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { CharacterBuilder } from "#/components/CharacterBuilder/CharacterBuilder.tsx"
import { Header } from "#/components/UI/Header.tsx"

export const Route = createFileRoute("/new/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack spacing={1}>
      <Header />
      <CharacterBuilder />
    </Stack>
  )
}
