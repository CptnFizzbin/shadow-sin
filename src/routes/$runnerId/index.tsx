import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/$runnerId/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate from={Route.fullPath} to="about" replace />
}
