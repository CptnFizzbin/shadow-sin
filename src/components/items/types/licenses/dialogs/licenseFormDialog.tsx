import type { FC } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { useLicenseForm } from "#/components/items/types/licenses/forms/useLicenseForm.tsx"
import { getLicenseCost } from "#/components/items/types/licenses/licenseUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { isSinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"

interface LicenseFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (data: LicenseData) => void
  onDelete?: () => void
  license?: LicenseData
  sin?: SinData
}

const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
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

export type UseLicenseFormDialogProps = Omit<LicenseFormDialogProps, "open" | "onClose" | "onClosed" | "onSave">

export const useLicenseFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseLicenseFormDialogProps) => dialogApi.open<LicenseData>(
      (dialogProps) => (
        <LicenseFormDialog
          {...dialogProps}
          {...props}
          onSave={(license) => dialogProps.onClose(license)}
        />
      ),
    ),
  }
}
