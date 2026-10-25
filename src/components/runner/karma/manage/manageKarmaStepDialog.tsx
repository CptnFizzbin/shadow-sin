import type { FC, ReactNode } from "react"

import { ControlledDialog } from "#/components/ui/dialog/dialog.tsx"
import type { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"

interface ManageKarmaStepDialogProps {
  ctrl: DialogCtrl<void>
  fullScreen?: boolean
  /** `Dialog.Title`, `Dialog.Content`, and `Dialog.Actions` slots for the step. */
  children: ReactNode
}

/** The dialog frame for one Manage Karma workflow step, which replaces the landing menu on screen. */
export const ManageKarmaStepDialog: FC<ManageKarmaStepDialogProps> = ({ ctrl, fullScreen, children }) => (
  <ControlledDialog ctrl={ctrl} maxWidth="sm" fullScreen={fullScreen} onClose={false} disableEnterTransition>
    {children}
  </ControlledDialog>
)
