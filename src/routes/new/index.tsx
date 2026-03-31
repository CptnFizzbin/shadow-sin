import { createFileRoute } from "@tanstack/react-router"

import { CharacterBuilder } from "#/components/CharacterBuilder/CharacterBuilder.tsx"

export const Route = createFileRoute("/new/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <CharacterBuilder />
  )
}
