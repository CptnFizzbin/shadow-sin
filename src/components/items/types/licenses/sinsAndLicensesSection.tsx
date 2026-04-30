import Button from "@mui/material/Button"
import { RiAddLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { useConfirmDialog } from "#/components/dialogs/confirmDialog.tsx"
import { useGearByType, useGearStore } from "#/components/items/useGearStore.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"

import { useLicenseFormDialog } from "./dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "./dialogs/sinFormDialog.tsx"
import { LicenseCard } from "./licenseCard.tsx"
import { SinCard } from "./sinCard.tsx"

interface SinsAndLicensesSectionSlots {
  sinTrailingContent?: (sin: SinData) => ReactNode
  licenseTrailingContent?: (license: LicenseData) => ReactNode
}

interface SinsAndLicensesSectionProps {
  slots?: SinsAndLicensesSectionSlots
}

export const SinsAndLicensesSection: FC<SinsAndLicensesSectionProps> = ({
  slots,
}) => {
  const confirmDialog = useConfirmDialog()
  const gearStore = useGearStore()
  const sins = useGearByType<SinData>(ItemType.sin)
  const licenses = useGearByType<LicenseData>(ItemType.license)
  const sinFormDialog = useSinFormDialog()
  const licenseFormDialog = useLicenseFormDialog()

  const handleRemoveSin = async (sin: SinData, hasLicenses: boolean) => {
    if (hasLicenses) {
      const confirmed = await confirmDialog.confirm({
        title: `Remove SIN "${sin.name}"?`,
        body: "This will also remove all associated licenses.",
        confirmLabel: "Remove SIN",
      })
      if (!confirmed) return
    }
    gearStore.remove(sin, { removeChildren: true })
  }

  const handleRemoveLicense = (license: LicenseData) => {
    gearStore.remove(license)
  }

  const handleEditSin = async (sin?: SinData) => {
    const saved = await sinFormDialog.open({
      sin,
      onDelete: sin
        ? () => {
            const sinLicenses = licenses.filter((l) => l.parentId === sin.id)
            void handleRemoveSin(sin, sinLicenses.length > 0)
          }
        : undefined,
    }).result
    if (saved) gearStore.save(saved)
  }

  const handleEditLicense = async (sin?: SinData, license?: LicenseData) => {
    const saved = await licenseFormDialog.open({
      sin,
      license,
      onDelete: license ? () => handleRemoveLicense(license) : undefined,
    }).result
    if (saved) gearStore.save(saved)
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditSin()}
        fullWidth
      >
        Add SIN
      </Button>

      {sins.map((sin) => {
        const sinLicenses = licenses.filter(
          (license) => license.parentId === sin.id,
        )
        const hasLicenses = sinLicenses.length > 0

        return (
          <SinCard
            key={sin.id}
            sin={sin}
            slots={{
              trailingContent: slots?.sinTrailingContent?.(sin),
            }}
            onClick={() => handleEditSin(sin)}
            onDelete={() => handleRemoveSin(sin, hasLicenses)}
          >
            {sinLicenses.map((license) => (
              <LicenseCard
                key={license.id}
                license={license}
                slots={{
                  trailingContent: slots?.licenseTrailingContent?.(license),
                }}
                onClick={() => handleEditLicense(sin, license)}
                onDelete={() => handleRemoveLicense(license)}
              />
            ))}

            <Button
              variant="text"
              color="secondary"
              size="small"
              startIcon={<RiAddLine size={14} />}
              onClick={(e) => {
                e.stopPropagation()
                void handleEditLicense(sin)
              }}
              fullWidth
            >
              Add License
            </Button>
          </SinCard>
        )
      })}
    </>
  )
}
