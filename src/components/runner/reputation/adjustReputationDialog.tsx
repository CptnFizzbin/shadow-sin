import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { removeReputationEntry } from "#/stores/runner/reputation/reputationSlice.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ReputationLedgerEntry } from "#/system/reputation/reputationLedgerEntry.ts"
import { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

import { ReputationDisplay } from "./reputationDisplay.tsx"
import type { ReputationFilter } from "./reputationLedgerFilters.tsx"
import { ReputationLedgerFilters } from "./reputationLedgerFilters.tsx"
import { ReputationLedgerList } from "./reputationLedgerList.tsx"
import { useAddReputationEntryForm } from "./useAddReputationEntryForm.tsx"
import { useEditReputationEntryForm } from "./useEditReputationEntryForm.tsx"

type AdjustReputationDialogProps = ControlledDialogProps<void>

const AdjustReputationDialog: FC<AdjustReputationDialogProps> = ({ ctrl }) => {
  const dispatch = useRunnerStoreDispatch()
  const addEntryForm = useAddReputationEntryForm()
  const editEntryForm = useEditReputationEntryForm()
  const confirmDialog = useConfirmDialog()

  const [ledgerFilters, setLedgerFilters] = useState<ReputationFilter>({ statTypes: Object.values(ReputationStatType) })

  const handleDelete = async (entry: ReputationLedgerEntry) => {
    if (await confirmDialog.confirm({
      title: "Remove entry from Ledger?",
      body: `Are you sure you want to remove the "${entry.stat} - ${entry.description}" entry?`,
      confirmLabel: "Delete Entry",
    })) {
      dispatch(removeReputationEntry({ id: entry.id }))
    }
  }

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
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <ReputationLedgerFilters onChange={setLedgerFilters} filters={ledgerFilters} />

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => addEntryForm.open()}
                >
                  Add Entry
                </Button>
              </Stack>

              <ReputationLedgerList
                filters={ledgerFilters}
                onEdit={(entry) => editEntryForm.open({ entry })}
                onDelete={(entry) => handleDelete(entry)}
              />
            </Stack>
          </Stack>
        </Dialog.Content>

        <Dialog.Actions>
          <Button color="secondary" variant="contained" onClick={() => ctrl.close()}>
            Close
          </Button>
        </Dialog.Actions>
      </ControlledDialog>

      {addEntryForm.outlet}
      {editEntryForm.outlet}
      {confirmDialog.outlet}
    </>
  )
}

export const useAdjustReputationDialog = () => useDialog<void>((ctrl) => <AdjustReputationDialog ctrl={ctrl} />)
