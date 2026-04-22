import type { FC } from "react"

import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import { useLicenseForm } from "#/components/licenses/forms/useLicenseForm.tsx"
import { getLicenseCost } from "#/components/licenses/licenseUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { isSinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"

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
      getCost={(l) => getLicenseCost(Number(l.rating))}
      ratingMax={6}
      parentItemFilter={(item: ItemData) => isSinData(item)}
      parentItemLabel="SIN"
      options={{ hasRating: { forced: true }, isSubItem: { forced: true } }}
    />
  )
}
