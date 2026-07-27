import Button from "@mui/material/Button"
import { RiAddLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { useGearByType } from "#/components/items/gearHooks.ts"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
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
  const dispatch = useRunnerStoreDispatch()
  const sins = useGearByType<SinData>(ItemType.sin)
  const licenses = useGearByType<LicenseData>(ItemType.license)
  const sinFormDialog = useSinFormDialog()
  const licenseFormDialog = useLicenseFormDialog()

  const saveItem = (item: SinData | LicenseData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))

  const handleRemoveSin = async (sin: SinData, hasLicenses: boolean) => {
    if (hasLicenses) {
      const confirmed = await confirmDialog.confirm({
        title: `Remove SIN "${sin.name}"?`,
        body: "This will also remove all associated licenses.",
        confirmLabel: "Remove SIN",
      })
      if (!confirmed) return
    }
    dispatch(Actions.gear.removeItem({ id: sin.id, removeChildren: true }))
  }

  const handleRemoveLicense = (license: LicenseData) => {
    dispatch(Actions.gear.licenses.destroy(license.id))
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
    })
    if (saved) saveItem(saved)
  }

  const handleEditLicense = async (sin?: SinData, license?: LicenseData) => {
    const saved = await licenseFormDialog.open({
      sin,
      license,
      onDelete: license ? () => handleRemoveLicense(license) : undefined,
    })
    if (saved) saveItem(saved)
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

      {confirmDialog.dialog}
      {sinFormDialog.dialog}
      {licenseFormDialog.dialog}
    </>
  )
}
