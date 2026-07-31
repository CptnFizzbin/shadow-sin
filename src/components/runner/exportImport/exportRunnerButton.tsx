import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { useRunnerStoreContext } from "#/lib/contexts/runner/runnerStore.context.ts"

import { runnerDataToYaml, downloadTextFile } from "./exportUtils.ts"

export const ExportRunnerButton: FC = () => {
  const store = useRunnerStoreContext()

  const handleExport = () => {
    const runnerData = store.getState()
    const yamlContent = runnerDataToYaml(runnerData)
    const sanitizedName =
      (runnerData.profile.alias || runnerData.profile.name || "runner")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    downloadTextFile(yamlContent, `${sanitizedName}.sin`)
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
