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
    const runnerData = store.getState()
    const yamlContent = runnerDataToYaml(runnerData)
    const sanitizedName =
      (runnerData.profile.alias || runnerData.profile.name || "runner")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    const now = new Date()
    const isoDate = now.toISOString().slice(0, 10)

    downloadTextFile(yamlContent, `${sanitizedName}.${isoDate}.sin`)
    dispatch(recordLastExport(now.toISOString()))
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
