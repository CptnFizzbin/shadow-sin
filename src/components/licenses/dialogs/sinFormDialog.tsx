import type { FC } from "react"

import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import { SinFormFields } from "#/components/licenses/forms/sinFormFields.tsx"
import { sinFieldMap, useSinForm } from "#/components/licenses/forms/useSinForm.tsx"
import { getSinCost } from "#/components/licenses/sinUtils.ts"
import type { SinData } from "#/system/gear/sinData.ts"

interface SinFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (sin: SinData) => void
  onDelete?: () => void
  sin?: SinData
  allowReal?: boolean
}

export const SinFormDialog: FC<SinFormDialogProps> = ({
  open,
  sin,
  allowReal,
  onClose,
  onClosed,
  onSave,
  onDelete,
}) => {
  const title = sin ? "Edit SIN" : "Create SIN"

  const form = useSinForm({
    sin,
    onSubmit: onSave,
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={onClosed}
      onDelete={onDelete}
      getCost={(s) => getSinCost(s.rating === "real" ? "real" : Number(s.rating))}
      slots={{
        itemFields: () => (
          <SinFormFields form={form} allowReal={allowReal} fields={sinFieldMap} />
        ),
      }}
    />
  )
}
