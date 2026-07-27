import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { getLicenseCost } from "#/components/items/types/licenses/licenseUtils.ts"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { useLicenseForm } from "#/lib/hooks/items/types/licenses/forms/useLicenseForm.tsx"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { isSinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"

interface LicenseFormDialogProps {
  ctrl: AnyDialogCtrl
  onDelete?: () => void
  license?: LicenseData
  sin?: SinData
}

const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
  ctrl,
  onDelete,
  license,
  sin,
}) => {
  const title = license ? "Edit License" : "Create License"

  const form = useLicenseForm({
    license,
    parentId: sin?.id,
    onSubmit: (licenseData) => ctrl.close(licenseData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      onDelete={onDelete}
      getCost={(l) => getLicenseCost(Number(l.rating))}
      ratingMax={6}
      parentItemFilter={(item: ItemData) => isSinData(item)}
      parentItemLabel="SIN"
      options={{
        hasRating: { forced: true },
        isSubItem: { forced: true },
        showCost: { forced: true, enabled: false },
        showAvailability: { forced: true, enabled: false },
      }}
    />
  )
}

type UseLicenseFormDialogProps = Omit<LicenseFormDialogProps, "ctrl">

export const useLicenseFormDialog = () => useDialog<LicenseData, UseLicenseFormDialogProps | undefined>(
  (ctrl, props) => <LicenseFormDialog ctrl={ctrl} {...props} />,
)
