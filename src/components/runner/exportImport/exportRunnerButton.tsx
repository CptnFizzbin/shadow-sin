import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { useRunnerStoreContext } from "#/lib/contexts/runner/runnerStore.context.ts"
import { recordLastExport } from "#/lib/stores/runner/meta/metaSlice.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"

import { runnerDataToYaml, downloadTextFile } from "./exportUtils.ts"

export const ExportRunnerButton: FC = () => {
  const store = useRunnerStoreContext()
  const dispatch = useRunnerStoreDispatch()

  const handleExport = () => {
    const now = new Date()
    const isoTimestamp = now.toISOString()
    const isoDate = isoTimestamp.slice(0, 10)

    const runnerData = store.getState()
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
