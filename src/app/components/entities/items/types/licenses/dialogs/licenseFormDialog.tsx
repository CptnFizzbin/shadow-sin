import type { FC } from "react"

import { ItemDialog } from "#app/components/entities/items/dialogs/itemDialog.tsx"
import { LicenseCoveredItemsSection } from "#app/components/entities/items/types/licenses/licenseCoveredItemsSection.tsx"
import type { ItemData } from "#data/items/itemData.ts"
import type { LicenseData } from "#data/items/licenseData.ts"
import type { SinData } from "#data/items/sinData.ts"
import { isSinData } from "#data/items/sinData.ts"
import type { AnyDialogCtrl } from "#forms/dialog/dialogCtrl.ts"
import { useDialog } from "#forms/dialog/useDialog.tsx"
import { useLicenseForm } from "#forms/items/types/licenses/useLicenseForm.tsx"
import { getLicenseCost } from "#rules/items/licenseUtils.ts"

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
      parentItemRequired
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
