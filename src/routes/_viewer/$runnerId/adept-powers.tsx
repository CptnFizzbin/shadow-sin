import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_viewer/$runnerId/adept-powers")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$runnerId/powers", params })
  },
})
