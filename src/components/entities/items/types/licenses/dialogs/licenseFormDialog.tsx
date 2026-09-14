import type { FC } from "react"

import { ItemDialog } from "#/components/entities/items/dialogs/itemDialog.tsx"
import { LicenseCoveredItemsSection } from "#/components/entities/items/types/licenses/licenseCoveredItemsSection.tsx"
import { getLicenseCost } from "#/components/entities/items/types/licenses/licenseUtils.ts"
import { useLicenseForm } from "#/hooks/items/types/licenses/forms/useLicenseForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { AnyDialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { LicenseData } from "#/system/model/items/licenseData.ts"
import type { SinData } from "#/system/model/items/sinData.ts"
import { isSinData } from "#/system/model/items/sinData.ts"

interface LicenseFormDialogProps {
  ctrl: AnyDialogCtrl
  onDelete?: () => void
  license?: LicenseData
  sin?: SinData
  wizard?: boolean
}

export const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
  ctrl,
  onDelete,
  license,
  sin,
  wizard,
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
      wizard={wizard}
      onDelete={onDelete}
      getCost={(l) => {
        const licenseValues = l as LicenseData
        return getLicenseCost(licenseValues.isReal, licenseValues.rating ?? 0)
      }}
      ratingMax={6}
      parentItemFilter={(item: ItemData) => isSinData(item)}
      parentItemLabel="SIN"
      options={{
        hasRating: { forced: true },
        isSubItem: { forced: true },
        showCost: { forced: true, enabled: false },
        showAvailability: { forced: true, enabled: false },
      }}
      slots={{
        itemFields: () => license ? <LicenseCoveredItemsSection license={license} /> : undefined,
      }}
    />
  )
}

type UseLicenseFormDialogProps = Omit<LicenseFormDialogProps, "ctrl">

export const useLicenseFormDialog = () => useDialog<LicenseData, UseLicenseFormDialogProps | undefined>(
  (ctrl, props) => <LicenseFormDialog ctrl={ctrl} {...props} />,
)
