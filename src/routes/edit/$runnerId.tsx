import Box from "@mui/material/Box"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

import { RunnerEditor } from "#/components/builder/runnerEditor.tsx"
import { RunnerErrorRoute } from "#/components/runner/runnerErrorRoute.tsx"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"
import { RunnerManager } from "#/runner/runnerManager.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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
      <Suspense>
        <RunnerEditor runner={runner} />
      </Suspense>
    </Box>
  )
}
