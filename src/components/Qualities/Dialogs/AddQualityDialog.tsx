import type { FC } from "react"
import { QualityFormDialog } from "#/components/Qualities/Dialogs/QualityFormDialog.tsx"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export interface AddQualityDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (quality: QualityData) => void
}

export const AddQualityDialog: FC<AddQualityDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  return (
    <QualityFormDialog
      open={open}
      mode="create"
      onSave={onAdd}
      onClose={onClose}
    />
  )
}
