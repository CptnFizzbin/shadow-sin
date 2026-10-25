import type { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"

/** Props every Manage Karma workflow step receives from the dialog. */
export interface ManageKarmaStepProps {
  /** Controls the Manage Karma dialog; closing it ends the workflow. */
  ctrl: DialogCtrl<void>
  /** Returns to the dialog's landing step. */
  onBack: () => void
}
