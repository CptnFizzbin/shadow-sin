import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useAlertDialog } from "#/components/ui/dialog/alertDialog.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { stringifyError } from "#/lib/errors/errorUtils.ts"
import { useRunnerStoreContext } from "#/stores/runner/runnerStore.context.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { useYamlFileImport } from "./useYamlFileImport.ts"

export const ImportCurrentRunnerButton: FC = () => {
  const store = useRunnerStoreContext()
  const runnerName = useRunnerStoreSelector((s) => s.profile.alias || s.profile.name)

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
        store.setState(() => runner)
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
        Import
      </Button>
      {confirmDialog.dialog}
      {alertDialog.dialog}
    </>
  )
}
