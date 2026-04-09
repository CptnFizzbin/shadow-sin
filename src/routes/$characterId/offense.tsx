import { createFileRoute } from "@tanstack/react-router"

import { OffensePage } from "#/components/offense/offensePage.tsx"

export const Route = createFileRoute("/$characterId/offense")({
  component: RouteComponent,
})

function RouteComponent() {
  return <OffensePage />
}
