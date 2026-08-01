import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/_viewer/$runnerId/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate from={Route.fullPath} to="about" replace />
}
