import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { recordLastExport } from "#/state/runner/meta/meta.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerStateStore } from "#/state/runnerState.ts"

import { downloadTextFile, runnerDataToYaml } from "./exportUtils.ts"

export const ExportRunnerButton: FC = () => {
  const store = useRunnerStateStore()
  const dispatch = useRunnerStoreDispatch()

  const handleExport = () => {
    const now = new Date()
    const isoTimestamp = now.toISOString()
    const isoDate = isoTimestamp.slice(0, 10)

    const runnerData = store.getState().runner
    const sanitizedName =
      (runnerData.profile.alias || runnerData.profile.name || "runner")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    // The exported file should record this export as its own last-export date,
    // not the one from before this export ran.
    const yamlContent = runnerDataToYaml({
      ...runnerData,
      _meta_: { ...runnerData._meta_, lastExportDate: isoTimestamp },
    })

    downloadTextFile(yamlContent, `${sanitizedName}.${isoDate}.sin`)
    dispatch(recordLastExport(isoTimestamp))
  }

  return (
    <Button
      variant="outlined"
      color="info"
      size="small"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
    >
      Export
    </Button>
  )
}
