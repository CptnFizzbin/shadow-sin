import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { useRunnerManager } from "#/runner/runnerManagerContext.tsx"
import type { RunnerData } from "#/system/runnerData.ts"

import { useImportConflictDialog } from "./importConflictDialog.tsx"
import { resolveConflictedRunner } from "./importUtils.ts"
import { useYamlFileImport } from "./useYamlFileImport.ts"

interface ImportRunnerButtonProps {
  onImported?: () => void | Promise<void>
}

export const ImportRunnerButton: FC<ImportRunnerButtonProps> = ({ onImported }) => {
  const importConflictDialog = useImportConflictDialog()
  const runnerManager = useRunnerManager()

  const handleParsed = async (runner: RunnerData) => {
    const existing = await runnerManager.findRunner(runner.id)

    const runnerToSave = existing
      ? await resolveConflictedRunner(runner, existing, importConflictDialog, runnerManager)
      : runner

    if (runnerToSave !== null) {
      await runnerManager.saveRunner(runnerToSave)
      await onImported?.()
    }
  }

  const { inputProps, openFilePicker } = useYamlFileImport({
    onParsed: handleParsed,
    onError: (error) => {
      console.error("Failed to parse YAML file:", error)
    },
  })

  return (
    <>
      <input {...inputProps} />
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={openFilePicker}
      >
        Import
      </Button>
      {importConflictDialog.dialog}
    </>
  )
}
