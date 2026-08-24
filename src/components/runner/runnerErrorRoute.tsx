import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { useNavigate, useRouter } from "@tanstack/react-router"

import { useRunnerManager } from "#/contexts/runner/runnerManagerContext.tsx"

import { downloadTextFile } from "./exportImport/exportUtils.ts"

export const RunnerErrorRoute = () => {
  const path = typeof window !== "undefined" ? window.location.pathname : ""
  const runnerId = path.split("/").filter(Boolean).pop() ?? "unknown"
  const navigate = useNavigate()
  const router = useRouter()
  const runnerManager = useRunnerManager()

  const handleExport = async () => {
    const raw = await runnerManager.getRawRunner(runnerId).catch(() => null)
    const rawData = raw ?? { runnerId }
    const jsonContent = JSON.stringify(rawData, null, 2)
    downloadTextFile(jsonContent, `invalid-runner-${runnerId}.json`, "application/json")
  }

  const handleDelete = async () => {
    await runnerManager.deleteRunner(runnerId)
    await router.invalidate()
    await navigate({ to: "/" })
  }

  return (
    <Stack sx={{ gap: 2, padding: 2 }}>
      <Alert severity="error">
        <AlertTitle>Failed to load runner</AlertTitle>
        This runner sheet could not be loaded. It may be corrupted or from an incompatible version.
      </Alert>

      <Stack direction="row">
        <Button variant="outlined" onClick={handleExport}>
          Export raw data as JSON
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete runner
        </Button>
        <Button variant="text" onClick={() => navigate({ to: "/" })}>
          Back to roster
        </Button>
      </Stack>
    </Stack>
  )
}
