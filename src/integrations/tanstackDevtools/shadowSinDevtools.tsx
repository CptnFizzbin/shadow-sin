import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useRouter } from "@tanstack/react-router"
import { useState } from "react"

import { useRunnerManager } from "#/contexts/runner/runnerManagerContext.tsx"
import { Artemis } from "#/data/fixtures/artemis.ts"
import { Hexen } from "#/data/fixtures/hexen.ts"

function ShadowSinDevtoolsPanel() {
  const router = useRouter()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const runnerManager = useRunnerManager()

  async function clearAllRunners() {
    const runners = await runnerManager.listRunners()
    await Promise.all(
      runners.map((savedChar) =>
        runnerManager.deleteRunner(savedChar.id),
      ),
    )
    await router.invalidate({ sync: true })
    setStatusMessage(`Cleared ${runners.length} runner(s).`)
  }

  async function reloadFixtureRunners() {
    const fixtureRunners = [Artemis, Hexen]
    for (const runner of fixtureRunners) {
      await runnerManager.saveRunner(runner)
    }
    await router.invalidate({ sync: true })
    setStatusMessage(`Reloaded ${fixtureRunners.length} fixture runner(s).`)
  }

  return (
    <Stack sx={{ padding: 2 }}>
      <Typography variant="h6">ShadowSIN</Typography>
      <Stack direction="row">
        <Button variant="outlined" color="error" onClick={clearAllRunners}>
          Clear All Runners
        </Button>
        <Button variant="outlined" onClick={reloadFixtureRunners}>
          Reload Fixture Runners
        </Button>
      </Stack>
      {statusMessage && (
        <Typography variant="body2" color="text.secondary">
          {statusMessage}
        </Typography>
      )}
    </Stack>
  )
}

export const ShadowSinDevtools = {
  id: "shadow-sin",
  name: "ShadowSIN",
  render: <ShadowSinDevtoolsPanel />,
}
