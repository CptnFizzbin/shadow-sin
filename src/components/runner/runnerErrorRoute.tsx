import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { dump } from "js-yaml"

import { useRunnerManager } from "#/contexts/runner/runnerManagerContext.tsx"
import type { JsonValue } from "#/lib/jsonUtils.ts"

import { downloadTextFile } from "./exportImport/exportUtils.ts"

/**
 * Best-effort display name for a raw (possibly corrupted or old-format) runner payload,
 * sanitised for use in a downloaded file name. Falls back to `"runner"` when no usable
 * name field is present.
 */
function extractRunnerName(rawData: JsonValue): string {
  const record =
    rawData !== null && typeof rawData === "object" && !Array.isArray(rawData)
      ? (rawData as Record<string, JsonValue>)
      : {}

  const profile =
    record.profile !== null && typeof record.profile === "object" && !Array.isArray(record.profile)
      ? (record.profile as Record<string, JsonValue>)
      : {}

  const name = profile.alias ?? profile.name ?? record.alias ?? record.name
  const sanitized =
    typeof name === "string"
      ? name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      : ""

  return sanitized || "runner"
}

export const RunnerErrorRoute = () => {
  const path = typeof window !== "undefined" ? window.location.pathname : ""
  const runnerId = path.split("/").filter(Boolean).pop() ?? "unknown"
  const navigate = useNavigate()
  const router = useRouter()
  const runnerManager = useRunnerManager()

  const handleExport = async () => {
    const raw = await runnerManager.getRawRunner(runnerId).catch(() => null)
    const rawData = raw ?? { runnerId }
    const yamlContent = dump(rawData, { lineWidth: 120 })
    const isoDate = new Date().toISOString().slice(0, 10)

    downloadTextFile(yamlContent, `${extractRunnerName(rawData)}.${isoDate}.error.sin`)
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
          Export raw data as YAML
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
