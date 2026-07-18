import Button from "@mui/material/Button"
import { RiSwordLine } from "@remixicon/react"
import type { FC } from "react"

import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialogCtrl } from "#/components/ui/dialog/useDialogCtrl.ts"
import { Prototype } from "#/components/ui/prototype/prototype.tsx"

import { CombatActionsAccordionVariant } from "./variants/combatActionsAccordionVariant.tsx"
import { CombatActionsBoardVariant } from "./variants/combatActionsBoardVariant.tsx"
import { CombatActionsTableVariant } from "./variants/combatActionsTableVariant.tsx"

export const CombatActionsCheatSheetButton: FC = () => {
  const ctrl = useDialogCtrl<void>()

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiSwordLine />}
        onClick={() => ctrl.open()}
      >
        Combat Actions Cheat Sheet
      </Button>

      <ControlledDialog ctrl={ctrl} maxWidth="md">
        <Dialog.Title>Combat Actions Cheat Sheet</Dialog.Title>
        <Dialog.Content dividers>
          <Prototype>
            <Prototype.Item title="Grouped accordion">
              <CombatActionsAccordionVariant />
            </Prototype.Item>
            <Prototype.Item title="Searchable table">
              <CombatActionsTableVariant />
            </Prototype.Item>
            <Prototype.Item title="Action-economy board">
              <CombatActionsBoardVariant />
            </Prototype.Item>
          </Prototype>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => ctrl.close()}>Close</Button>
        </Dialog.Actions>
      </ControlledDialog>
    </>
  )
}
