import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { LicenseFormFields } from "#/components/items/types/licenses/forms/licenseFormFields.tsx"
import { licenseFieldMap, useLicenseForm } from "#/components/items/types/licenses/forms/useLicenseForm.tsx"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"

export interface LicenseFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (data: LicenseData) => void
  license?: LicenseData
  sin?: SinData
}

export const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  onSave,
  license,
  sin,
}) => {
  const form = useLicenseForm({
    license,
    parentId: sin?.id,
    onSubmit: onSave,
  })

  const title = license ? "Edit License" : "Create License"

  return (
    <ItemDialog
      form={form}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={onClosed}
      slots={{
        itemFields: () => (
          <LicenseFormFields form={form} fields={licenseFieldMap} />
        ),
      }}
    />
  )
}
