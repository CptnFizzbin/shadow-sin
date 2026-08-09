import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { createFileRoute, useRouter } from "@tanstack/react-router"

import { LandingModeSwitch } from "#/components/landing/landingModeSwitch.tsx"
import { ImportRunnerButton } from "#/components/runner/exportImport/importRunnerButton.tsx"
import RunnerRosterList from "#/components/runner/runnerRosterList.tsx"
import { Artemis } from "#/data/fixtures/artemis.ts"
import { Hexen } from "#/data/fixtures/hexen.ts"
import { env } from "#/env.ts"
import { RunnerManager } from "#/lib/persistence/runnerManager.ts"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"

// Module-level manager for use in loaders (outside React context)
const loaderManager = new RunnerManager({ local: LocalStorageProvider.getStorage() })

export const Route = createFileRoute("/")({
  loader: () => {
    const fixtures = (import.meta.env.DEV || env.VITE_SEED_FIXTURES) ? [Artemis, Hexen] : []
    return loaderManager.ensureRunners(fixtures)
  },
  component: IndexRoute,
})

function IndexRoute() {
  const navigate = Route.useNavigate()
  const router = useRouter()
  const { runners, errors } = Route.useLoaderData()

  return (
    <Stack sx={{ padding: 1 }}>
      <LandingModeSwitch />

      <Stack direction="row">
        <Button
          variant="outlined"
          onClick={() => {
            navigate({ to: "/new" })
          }}
        >
          Create New
        </Button>
        <ImportRunnerButton onImported={() => router.invalidate({ sync: true })} />
      </Stack>
      <RunnerRosterList runners={runners} errors={errors} />
    </Stack>
  )
}
