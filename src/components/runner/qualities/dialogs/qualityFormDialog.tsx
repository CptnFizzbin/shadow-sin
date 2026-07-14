import type { FC } from "react"

import { QualityFormFields } from "#/components/runner/qualities/form/qualityFormFields.tsx"
import { useQualityForm } from "#/components/runner/qualities/form/useQualityForm.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { FormDialogActions } from "#/components/ui/dialog/formDialogActions.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
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

  const title = editMode ? "Edit Quality" : "Add Quality"

  return (
    <ControlledDialog
      ctrl={ctrl}
      maxWidth="sm"
      onClose={false}
      onClosed={() => form.reset()}
    >
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <QualityFormFields form={form} />
      </Dialog.Content>
      <Dialog.Actions>
        <FormDialogActions
          onCancel={() => ctrl.close()}
          onSave={() => form.handleSubmit()}
          onDelete={onDelete && (() => {
            onDelete()
            ctrl.close()
          })}
        />
      </Dialog.Actions>
    </ControlledDialog>
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
