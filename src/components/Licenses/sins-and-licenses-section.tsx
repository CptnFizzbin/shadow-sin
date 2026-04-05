import Button from "@mui/material/Button"
import { RiAddLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { useState } from "react"

import { useGearStore, useGearByType } from "#/components/Gear/use-gear-api.ts"
import { LicenseFormDialog } from "#/components/Licenses/Dialogs/license-form-dialog.tsx"
import { SinFormDialog } from "#/components/Licenses/Dialogs/sin-form-dialog.tsx"
import { SinRemoveDialog } from "#/components/Licenses/Dialogs/sin-remove-dialog.tsx"
import { LicenseCard } from "#/components/Licenses/license-card.tsx"
import { SinCard } from "#/components/Licenses/sin-card.tsx"
import type { LicenseData } from "#/lib/system/gear/license-data.ts"
import type { SinData } from "#/lib/system/gear/sin-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"

export interface SinsAndLicensesSectionSlots {
  sinTrailingContent?: (sin: SinData) => ReactNode
  licenseTrailingContent?: (license: LicenseData) => ReactNode
}

export interface SinsAndLicensesSectionProps {
  slots?: SinsAndLicensesSectionSlots
}

type DialogState =
  | null
  | { type: "sin", sin?: SinData, open: boolean }
  | { type: "license", sin?: SinData, license?: LicenseData, open: boolean }

type RemoveDialogState = null | { sin: SinData, open: boolean }

export const SinsAndLicensesSection: FC<SinsAndLicensesSectionProps> = ({
  slots,
}) => {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const [removeDialog, setRemoveDialog] = useState<RemoveDialogState>(null)
  const gearStore = useGearStore()
  const sins = useGearByType<SinData>(GearType.sin)
  const licenses = useGearByType<LicenseData>(GearType.license)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const onRemoveDialogClose = () => {
    setRemoveDialog((prev) => prev && { ...prev, open: false })
  }

  const onRemoveDialogClosed = () => {
    setRemoveDialog(null)
  }

  const hasRealSin = sins.some((sin) => sin.rating === "real")

  const handleSaveSin = (sin: SinData) => {
    gearStore.save(sin)
    onDialogClose()
  }

  const handleRemoveSin = (sin: SinData) => {
    gearStore.remove(sin, { removeChildren: true })
    onDialogClose()
    onRemoveDialogClose()
  }

  const handleSaveLicense = (license: LicenseData) => {
    gearStore.save(license)
    onDialogClose()
  }

  const handleRemoveLicense = (license: LicenseData) => {
    gearStore.remove(license)
    onDialogClose()
  }

  const openRemoveDialog = (sin: SinData) => {
    onDialogClose()
    setRemoveDialog({ sin, open: true })
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
            onDelete={() => {
              if (hasLicenses) {
                setRemoveDialog({ sin, open: true })
              } else {
                handleRemoveSin(sin)
              }
            }}
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
                  if (licenses.some((l) => l.parentId === dialogState.sin!.id)) {
                    openRemoveDialog(dialogState.sin!)
                  } else {
                    handleRemoveSin(dialogState.sin!)
                  }
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

      {removeDialog && (
        <SinRemoveDialog
          open={removeDialog.open}
          sin={removeDialog.sin}
          onConfirm={() => handleRemoveSin(removeDialog.sin)}
          onClose={onRemoveDialogClose}
          onClosed={onRemoveDialogClosed}
        />
      )}
    </>
  )
}
