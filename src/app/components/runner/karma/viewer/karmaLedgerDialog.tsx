import Button from "@mui/material/Button"
import type { FC } from "react"

import type { ControlledDialogProps } from "#ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#ui/dialog/dialog.tsx"
import { useDialog } from "#ui/dialog/useDialog.tsx"

import { KarmaLedgerList } from "./karmaLedgerList.tsx"

const KarmaLedgerDialog: FC<ControlledDialogProps> = ({ ctrl }) => (
  <ControlledDialog ctrl={ctrl} maxWidth="md">
    <Dialog.Title>Karma Ledger</Dialog.Title>
    <Dialog.Content>
      <KarmaLedgerList />
    </Dialog.Content>
    <Dialog.Actions>
      <Button color="secondary" variant="contained" onClick={() => ctrl.close()}>Close</Button>
    </Dialog.Actions>
  </ControlledDialog>
)

/** Opens a read-only view of the Runner's karma ledger. */
export const useKarmaLedgerDialog = () => useDialog<void>((ctrl) => <KarmaLedgerDialog ctrl={ctrl} />)
