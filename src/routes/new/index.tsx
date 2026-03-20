import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { CharacterForm } from "#/components/Character/Form/CharacterForm.tsx"
import { Header } from "#/components/UI/Header.tsx"

export const Route = createFileRoute("/new/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack spacing={1}>
      <Header />
      <CharacterForm />
    </Stack>
  )
}
