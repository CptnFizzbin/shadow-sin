import Button from "@mui/material/Button"
import type { FC } from "react"

interface ItemDialogWizardActionsProps {
  onCancel: () => void
  onBack?: () => void
  onNext: () => void
}

/**
 * Cancel / Back / Next footer shown on the non-final steps of the Add Item wizard
 * (`ItemDialog`'s `wizard` mode). The final step shows `ItemDialogActions` instead.
 */
export const ItemDialogWizardActions: FC<ItemDialogWizardActionsProps> = ({
  onCancel,
  onBack,
  onNext,
}) => (
  <>
    <Button onClick={onCancel} sx={{ mr: "auto" }}>Cancel</Button>
    {onBack && <Button onClick={onBack}>Back</Button>}
    <Button variant="contained" onClick={onNext}>Next</Button>
  </>
)
