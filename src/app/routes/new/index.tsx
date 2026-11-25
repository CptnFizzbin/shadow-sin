import Box from "@mui/material/Box"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

import { BuilderLoadErrorBoundary } from "#/app/components/builder/builderLoadErrorBoundary.tsx"
import { RunnerBuilder } from "#/app/components/builder/runnerBuilder.tsx"
import { getRunnerStorageKey } from "#/state/persistence/builderDraftKey.ts"

export const Route = createFileRoute("/new/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box sx={{ padding: 1 }}>
      <BuilderLoadErrorBoundary runnerStorageKey={getRunnerStorageKey()}>
        <Suspense>
          <RunnerBuilder />
        </Suspense>
      </BuilderLoadErrorBoundary>
    </Box>
  )
}
