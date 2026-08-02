import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/$runnerId/_viewer/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate from={Route.fullPath} to="about" replace />
}
