import Button from "@mui/material/Button"
import { RiAddLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { useState } from "react"

import { useGearByType, useGearStore } from "#/components/gear/useGearApi.ts"
import { LicenseFormDialog } from "#/components/licenses/dialogs/licenseFormDialog.tsx"
import { SinFormDialog } from "#/components/licenses/dialogs/sinFormDialog.tsx"
import { LicenseCard } from "#/components/licenses/licenseCard.tsx"
import { SinCard } from "#/components/licenses/sinCard.tsx"
import { useConfirmDialog } from "#/components/ui/dialogs/useConfirmDialog.tsx"
import type { LicenseData } from "#/lib/system/gear/licenseData.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export interface SinsAndLicensesSectionSlots {
  sinTrailingContent?: (sin: SinData) => ReactNode
  licenseTrailingContent?: (license: LicenseData) => ReactNode
}

export interface SinsAndLicensesSectionProps {
  slots?: SinsAndLicensesSectionSlots
}

type DialogState =
  | { type: "sin", sin?: SinData, open: boolean }
  | { type: "license", sin?: SinData, license?: LicenseData, open: boolean }

export const SinsAndLicensesSection: FC<SinsAndLicensesSectionProps> = ({
  slots,
}) => {
  const [dialogState, setDialogState] = useState<DialogState | null>(null)
  const confirmDialog = useConfirmDialog({ id: "remove-sin-confirm" })
  const gearStore = useGearStore()
  const sins = useGearByType<SinData>(ItemType.sin)
  const licenses = useGearByType<LicenseData>(ItemType.license)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const hasRealSin = sins.some((sin) => sin.rating === "real")

  const handleSaveSin = (sin: SinData) => {
    gearStore.save(sin)
    onDialogClose()
  }

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
    onDialogClose()
  }

  const handleSaveLicense = (license: LicenseData) => {
    gearStore.save(license)
    onDialogClose()
  }

  const handleRemoveLicense = (license: LicenseData) => {
    gearStore.remove(license)
    onDialogClose()
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ type: "sin", open: true })}
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
            onClick={() => setDialogState({ type: "sin", sin, open: true })}
            onDelete={() => handleRemoveSin(sin, hasLicenses)}
          >
            {sinLicenses.map((license) => (
              <LicenseCard
                key={license.id}
                license={license}
                slots={{
                  trailingContent: slots?.licenseTrailingContent?.(license),
                }}
                onClick={() =>
                  setDialogState({ type: "license", license, sin, open: true })}
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
                setDialogState({ type: "license", sin, open: true })
              }}
              fullWidth
            >
              Add License
            </Button>
          </SinCard>
        )
      })}

      {dialogState?.type === "sin" && (
        <SinFormDialog
          open={dialogState.open}
          sin={dialogState.sin}
          allowReal={!hasRealSin || dialogState.sin?.rating === "real"}
          onSave={handleSaveSin}
          onDelete={
            dialogState.sin
              ? () => {
                  const sinLicenses = licenses.filter(
                    (l) => l.parentId === dialogState.sin!.id,
                  )
                  handleRemoveSin(dialogState.sin!, sinLicenses.length > 0)
                }
              : undefined
          }
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.type === "license" && (
        <LicenseFormDialog
          open={dialogState.open}
          sin={dialogState.sin}
          license={dialogState.license}
          onSave={handleSaveLicense}
          onDelete={
            dialogState.license
              ? () => handleRemoveLicense(dialogState.license!)
              : undefined
          }
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </>
  )
}
