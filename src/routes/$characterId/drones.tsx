import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$characterId/drones")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$characterId/drones"!</div>
}
