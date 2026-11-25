import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { useAlertDialog } from "#/components/ui/dialog/alertDialog.tsx"
import { useYamlFileImport } from "#/hooks/runner/exportImport/useYamlFileImport.ts"
import { useRunnerManager } from "#/hooks/runner/useRunnerManager.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { stringifyError } from "#/utils/errors/errorUtils.ts"

import { useImportConflictDialog } from "./importConflictDialog.tsx"
import { resolveConflictedRunner } from "./importUtils.ts"

interface ImportRunnerButtonProps {
  onImported?: () => void | Promise<void>
}

export const ImportRunnerButton: FC<ImportRunnerButtonProps> = ({ onImported }) => {
  const importConflictDialog = useImportConflictDialog()
  const alertDialog = useAlertDialog()
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
    onError: async (error) => {
      console.error("Failed to parse YAML file:", error)
      await alertDialog.open({
        title: "Import failed",
        body: `The selected file could not be imported: ${stringifyError(error)}`,
      })
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
      {importConflictDialog.outlet}
      {alertDialog.outlet}
    </>
  )
}
