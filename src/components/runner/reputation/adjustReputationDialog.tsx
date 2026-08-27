import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { ReputationSelectors } from "#/stores/runner/reputation/reputationSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { ReputationLedgerList } from "./reputationLedgerList.tsx"
import { useAddReputationEntryForm } from "./useAddReputationEntryForm.tsx"

type AdjustReputationDialogProps = ControlledDialogProps<void>

const AdjustReputationDialog: FC<AdjustReputationDialogProps> = ({ ctrl }) => {
  const streetCred = useRunnerSelector(ReputationSelectors.selectStreetCred)
  const notoriety = useRunnerSelector(ReputationSelectors.selectNotoriety)
  const publicAwareness = useRunnerSelector(ReputationSelectors.selectPublicAwareness)
  const addEntryForm = useAddReputationEntryForm()

  return (
    <ControlledDialog ctrl={ctrl} onClose={false}>
      <Dialog.Title>Adjust Reputation</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2 }}>
          {/* Current Reputation Display */}
          <Stack direction="row" sx={{ gap: 2, justifyContent: "space-around", textAlign: "center" }}>
            <Stack>
              <Typography variant="caption" color="textSecondary">Street Cred</Typography>
              <Typography variant="h6">{streetCred}</Typography>
            </Stack>
            <Stack>
              <Typography variant="caption" color="textSecondary">Notoriety</Typography>
              <Typography variant="h6">{notoriety}</Typography>
            </Stack>
            <Stack>
              <Typography variant="caption" color="textSecondary">Public Awareness</Typography>
              <Typography variant="h6">{publicAwareness.rating}</Typography>
            </Stack>
          </Stack>

          <Divider />

          {/* Ledger */}
          <Stack sx={{ gap: 1 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2">Event Log</Typography>
              <Button size="small" variant="outlined" onClick={() => addEntryForm.open()}>
                Add Entry
              </Button>
            </Stack>

            <ReputationLedgerList />
          </Stack>
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" variant="contained" onClick={() => ctrl.close()}>
          Close
        </Button>
      </Dialog.Actions>

      {addEntryForm.outlet}
    </ControlledDialog>
  )
}

export const useAdjustReputationDialog = () => useDialog<void>((ctrl) => <AdjustReputationDialog ctrl={ctrl} />)
