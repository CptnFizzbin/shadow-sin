import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"

import { runnerDataToYaml, downloadTextFile } from "./exportUtils.ts"

export const ExportRunnerButton: FC = () => {
  const store = useRunnerDataContext()

  const handleExport = () => {
    const runnerData = store.get()
    const yamlContent = runnerDataToYaml(runnerData)
    const sanitizedName =
      (runnerData.profile.alias || runnerData.profile.name || "runner")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    downloadTextFile(yamlContent, `${sanitizedName}.yaml`)
  }

  return (
    <Button
      variant="outlined"
      color="info"
      size="small"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
    >
      Export YAML
    </Button>
  )
}
