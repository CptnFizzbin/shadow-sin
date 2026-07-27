import type { FC } from "react"

import { QualityFormFields } from "#/components/runner/qualities/form/qualityFormFields.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { FormDialog } from "#/components/ui/dialog/formDialog.tsx"
import { useQualityForm } from "#/lib/hooks/runner/qualities/form/useQualityForm.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { QualityData } from "#/system/qualityData.ts"

interface QualityFormDialogProps extends ControlledDialogProps<QualityData> {
  quality?: QualityData
  onDelete?: () => void
}

const QualityFormDialog: FC<QualityFormDialogProps> = ({
  ctrl,
  quality,
  onDelete,
}) => {
  const editMode = !!quality

  const form = useQualityForm({
    quality,
    onSubmit: (savedQuality) => ctrl.close(savedQuality),
  })

  return (
    <FormDialog
      ctrl={ctrl}
      title={editMode ? "Edit Quality" : "Add Quality"}
      onClosed={() => form.reset()}
      onDelete={onDelete}
      onSubmit={() => form.handleSubmit()}
    >
      <QualityFormFields form={form} />
    </FormDialog>
  )
}

type UseQualityFormDialogProps = Omit<
  QualityFormDialogProps,
  keyof ControlledDialogProps<QualityData>
>

export const useQualityFormDialog = () => useDialog<QualityData, UseQualityFormDialogProps | undefined>(
  (ctrl, props) => (
    <QualityFormDialog
      ctrl={ctrl}
      quality={props?.quality}
      onDelete={props?.onDelete}
    />
  ),
)
