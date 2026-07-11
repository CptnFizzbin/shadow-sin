import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$runnerId/adept-powers")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$runnerId/powers", params })
  },
})
