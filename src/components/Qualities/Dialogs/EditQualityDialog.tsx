import type { FC } from "react"
import { QualityFormDialog } from "#/components/Qualities/Dialogs/QualityFormDialog.tsx"
import { noop } from "#/lib/noop.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export interface QualityDialogProps {
  quality: QualityData
  open: boolean
  onSave: (updated: QualityData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

export const EditQualityDialog: FC<QualityDialogProps> = ({
  quality,
  open,
  onSave,
  onDelete,
  onClose,
  onClosed = noop,
}) => {
  return (
    <QualityFormDialog
      open={open}
      mode="edit"
      quality={quality}
      onSave={onSave}
      onDelete={onDelete}
      onClose={onClose}
      onClosed={onClosed}
    />
  )
}
