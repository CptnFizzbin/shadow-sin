import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useRunnerDataSelector } from "#/components/runner/sheet/runnerData.selectors.ts"
import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { useAlertDialog } from "#/components/ui/dialog/alertDialog.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { stringifyError } from "#/lib/errors/errorUtils.ts"

import { useYamlFileImport } from "./useYamlFileImport.ts"

export const ImportCurrentRunnerButton: FC = () => {
  const store = useRunnerDataContext()
  const runnerName = useRunnerDataSelector((s) => s.profile.alias || s.profile.name)

  const confirmDialog = useConfirmDialog()
  const alertDialog = useAlertDialog()

  const { inputProps, openFilePicker } = useYamlFileImport({
    onParsed: async (runner) => {
      const performOverwrite = await confirmDialog.confirm({
        title: "Overwrite runner?",
        body: (
          <Typography>
            Importing will overwrite <strong>{runnerName}</strong> with the imported data. This cannot be
            undone.
          </Typography>
        ),
        slotProps: {
          confirmButton: { label: "Overwrite", color: "warning" },
        },
      })

      if (performOverwrite) {
        store.set(runner)
      }
    },
    onError: async (error) => {
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
        color="warning"
        size="small"
        startIcon={<UploadIcon />}
        onClick={openFilePicker}
      >
        Import YAML
      </Button>
      {confirmDialog.dialog}
      {alertDialog.dialog}
    </>
  )
}
