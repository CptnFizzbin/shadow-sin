import type { FC } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import type { AnyDialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { FocusFormFields } from "#/components/items/types/foci/forms/focusFormFields.tsx"
import { focusFieldMap, useFocusForm } from "#/components/items/types/foci/forms/useFocusForm.tsx"
import type { FocusData } from "#/system/gear/focusData.ts"

interface FocusFormDialogProps {
  ctrl: AnyDialogCtrl
  focus?: FocusData
}

export const FocusFormDialog: FC<FocusFormDialogProps> = ({ ctrl, focus }) => {
  const title = focus ? "Edit Focus" : "Add Focus"

  const form = useFocusForm({
    focus,
    onSubmit: (focusData) => ctrl.close(focusData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      ratingMax={6}
      options={{
        hasRating: { forced: true },
        hasEffects: { forced: true },
        showCost: { forced: true },
        showAvailability: { forced: true },
        multiple: { forced: true, enabled: false },
      }}
      slots={{
        itemFields: () => <FocusFormFields form={form} fields={focusFieldMap} />,
      }}
    />
  )
}

type UseFocusFormDialogProps = Omit<FocusFormDialogProps, "ctrl">

export const useFocusFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseFocusFormDialogProps) => dialogApi.open<FocusData>(
      (ctrl) => <FocusFormDialog ctrl={ctrl} {...props} />,
    ),
  }
}
