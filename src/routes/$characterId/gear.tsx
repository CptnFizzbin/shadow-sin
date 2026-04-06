import { createFileRoute } from "@tanstack/react-router"

import { GearViewPage } from "#/components/character/gearPage/gearViewPage.tsx"

export const Route = createFileRoute("/$characterId/gear")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <GearViewPage />
  )
}
