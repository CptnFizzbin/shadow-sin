import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$runnerId/_viewer/adept-powers")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$runnerId/powers", params })
  },
})
