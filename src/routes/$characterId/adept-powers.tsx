import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$characterId/adept-powers")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$characterId/powers", params })
  },
})
