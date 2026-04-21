import type { FC } from "react"

import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import { LicenseFormFields } from "#/components/licenses/forms/licenseFormFields.tsx"
import { licenseFieldMap, useLicenseForm } from "#/components/licenses/forms/useLicenseForm.tsx"
import { getLicenseCost } from "#/components/licenses/licenseUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"

export interface LicenseFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (data: LicenseData) => void
  onDelete?: () => void
  license?: LicenseData
  sin?: SinData
}

export const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  onSave,
  onDelete,
  license,
  sin,
}) => {
  const title = license ? "Edit License" : "Create License"

  const form = useLicenseForm({
    license,
    parentId: sin?.id,
    sinReal: sin?.rating === "real" || false,
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
      getCost={(l) => getLicenseCost(l.rating === "real" ? "real" : Number(l.rating))}
      slots={{
        itemFields: () => (
          <LicenseFormFields form={form} fields={licenseFieldMap} />
        ),
      }}
    />
  )
}
