import Box from "@mui/material/Box"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

import { BuilderLoadErrorBoundary } from "#app/components/builder/builderLoadErrorBoundary.tsx"
import { RunnerEditor } from "#app/components/builder/runnerEditor.tsx"
import { RunnerErrorRoute } from "#app/components/runner/runnerErrorRoute.tsx"
import type { RunnerData } from "#data/runner/runnerData.ts"
import { getRunnerStorageKey } from "#state/persistence/builderDraftKey.ts"
import { RunnerManager } from "#state/persistence/runnerManager.ts"
import { LocalStorageProvider } from "#state/storage/providers/localStorageProvider.ts"

// Module-level manager for use in loaders (outside React context)
const loaderManager = new RunnerManager({ local: LocalStorageProvider.getStorage() })

export const Route = createFileRoute("/edit/$runnerId")({
  component: RouteComponent,
  errorComponent: RunnerErrorRoute,
  loader: ({ params }): Promise<RunnerData> => {
    return loaderManager.getRunner(params.runnerId)
  },
})

function RouteComponent() {
  const runner = Route.useLoaderData()

  return (
    <Box sx={{ padding: 1 }}>
      <BuilderLoadErrorBoundary runnerStorageKey={getRunnerStorageKey(runner.id)}>
        <Suspense>
          <RunnerEditor runner={runner} />
        </Suspense>
      </BuilderLoadErrorBoundary>
    </Box>
  )
}
