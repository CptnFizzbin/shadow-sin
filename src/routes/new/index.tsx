import Box from "@mui/material/Box"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

import { RunnerBuilder } from "#/components/builder/runnerBuilder.tsx"

export const Route = createFileRoute("/new/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box sx={{ padding: 1 }}>
      <Suspense>
        <RunnerBuilder />
      </Suspense>
    </Box>
  )
}
