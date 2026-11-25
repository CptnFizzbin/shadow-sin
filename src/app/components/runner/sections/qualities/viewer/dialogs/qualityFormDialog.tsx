import type { FC } from "react"

import { QualityFormFields } from "#app/components/runner/sections/qualities/viewer/form/qualityFormFields.tsx"
import type { QualityData } from "#data/qualities/qualityData.ts"
import { useQualityForm } from "#forms/qualities/useQualityForm.ts"
import type { ControlledDialogProps } from "#ui/dialog/controlledDialogProps.ts"
import { FormDialog } from "#ui/dialog/formDialog.tsx"
import { useDialog } from "#ui/dialog/useDialog.tsx"

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
