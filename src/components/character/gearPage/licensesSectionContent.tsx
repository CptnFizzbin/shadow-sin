import type { FC } from "react"

import { useLicenseFormDialog } from "#/components/items/types/licenses/dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "#/components/items/types/licenses/dialogs/sinFormDialog.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"

import { GearSectionAddButton } from "./gearSectionAddButton.tsx"
import { GearSectionContentScaffold } from "./gearSectionContentScaffold.tsx"

interface LicensesSectionContentProps {
  sins: SinData[]
  getLicenses: (sinId: string) => LicenseData[]
}

export const LicensesSectionContent: FC<LicensesSectionContentProps> = ({
  sins,
  getLicenses,
}) => {
  const gearStore = useGearStore()
  const sinFormDialog = useSinFormDialog()
  const licenseFormDialog = useLicenseFormDialog()

  const handleEditSin = async (sin?: SinData) => {
    const saved = await sinFormDialog.open({ sin })
    if (saved) gearStore.save(saved)
  }

  const handleEditLicense = async (sin: SinData, license?: LicenseData) => {
    const saved = await licenseFormDialog.open({ sin, license })
    if (saved) gearStore.save(saved)
  }

  return (
    <GearSectionContentScaffold
      items={sins}
      getSubItems={(sin) => getLicenses(sin.id)}
      getItemCallbacks={(sin) => ({
        onEdit: () => handleEditSin(sin),
        onRemove: () => gearStore.remove(sin, { removeChildren: true }),
        getSubItemCallbacks: (licenseId) => {
          const license = getLicenses(sin.id).find((item) => item.id === licenseId)
          return {
            onEdit: license
              ? () => handleEditLicense(sin, license)
              : undefined,
            onRemove: license ? () => gearStore.remove(license) : undefined,
          }
        },
      })}
      renderItemAction={(sin) => (
        <GearSectionAddButton
          label={`Add License to ${sin.name}`}
          onClick={() => handleEditLicense(sin)}
        />
      )}
      addAction={{ label: "Add SIN", onClick: () => handleEditSin() }}
    />
  )
}
