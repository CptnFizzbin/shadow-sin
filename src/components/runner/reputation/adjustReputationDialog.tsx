import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"

import { ReputationDisplay } from "./reputationDisplay.tsx"
import { ReputationLedgerList } from "./reputationLedgerList.tsx"
import { useAddReputationEntryForm } from "./useAddReputationEntryForm.tsx"

type AdjustReputationDialogProps = ControlledDialogProps<void>

const AdjustReputationDialog: FC<AdjustReputationDialogProps> = ({ ctrl }) => {
  const addEntryForm = useAddReputationEntryForm()

  return (
    <>
      <ControlledDialog ctrl={ctrl} onClose={false}>
        <Dialog.Title>Adjust Reputation</Dialog.Title>

        <Dialog.Content>
          <Stack sx={{ gap: 2 }}>
            {/* Same full-size display as the About page's Reputation card */}
            <ReputationDisplay />

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
      </ControlledDialog>

      {/* Rendered as a sibling, not a ControlledDialog child — DialogRoot only renders its
          recognized Title/Content/Actions slots and silently drops anything else, so nesting the
          outlet inside would mount it nowhere. */}
      {addEntryForm.outlet}
    </>
  )
}

export const useAdjustReputationDialog = () => useDialog<void>((ctrl) => <AdjustReputationDialog ctrl={ctrl} />)
