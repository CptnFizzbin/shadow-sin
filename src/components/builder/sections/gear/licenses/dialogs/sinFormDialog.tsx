import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { SinFormFields } from "#/components/items/types/licenses/forms/sinFormFields.tsx"
import { sinFieldMap, useSinForm } from "#/components/items/types/licenses/forms/useSinForm.tsx"
import type { SinData } from "#/system/gear/sinData.ts"

interface SinEditDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (sin: SinData) => void
  sin?: SinData
  allowReal?: boolean
}

export const SinFormDialog: FC<SinEditDialogProps> = ({
  open,
  sin,
  allowReal,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = sin ? "Edit SIN" : "Create SIN"
  const form = useSinForm({ sin, onSubmit: onSave })

  return (
    <ItemDialog
      form={form}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={onClosed}
      slots={{
        itemFields: () => (
          <SinFormFields form={form} allowReal={allowReal} fields={sinFieldMap} />
        ),
      }}
    />
  )
}
