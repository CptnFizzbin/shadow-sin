import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useAlertDialog } from "#/components/ui/dialog/alertDialog.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { useYamlFileImport } from "#/hooks/runner/exportImport/useYamlFileImport.ts"
import { mergeContacts } from "#/state/runner/contacts/contacts.actions.ts"
import { ProfileSelectors } from "#/state/runner/profile/profile.selector.ts"
import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { useRunnerStateDispatch } from "#/state/runnerState.ts"
import { stringifyError } from "#/utils/errors/errorUtils.ts"

export const ImportCurrentRunnerButton: FC = () => {
  const dispatch = useRunnerStateDispatch()
  const runnerName = useRunnerSelector(ProfileSelectors.selectDisplayName)

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
        dispatch(RunnerActions.load(runner))
      }
    },
    onDataPacket: async (packet) => {
      const contacts = packet.contacts ?? []
      if (contacts.length === 0) {
        await alertDialog.open({
          title: "Nothing to import",
          body: "The selected data packet doesn't contain anything to add to this runner.",
        })
        return
      }

      const performMerge = await confirmDialog.confirm({
        title: "Import data packet?",
        body: (
          <>
            <Typography gutterBottom>
              The following contacts will be added to <strong>{runnerName}</strong>. Any of them imported
              from an earlier packet will be updated in place.
            </Typography>
            <Typography component="ul">
              {contacts.map((contact) => <li key={contact.id}>{contact.name}</li>)}
            </Typography>
          </>
        ),
        slotProps: {
          confirmButton: { label: "Import", color: "primary" },
        },
      })

      if (performMerge) {
        dispatch(mergeContacts(contacts))
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
      {confirmDialog.outlet}
      {alertDialog.outlet}
    </>
  )
}
