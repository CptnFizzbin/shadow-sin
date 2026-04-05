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
  | { mode: "createSin", open: boolean }
  | { mode: "editSin", sin: SinData, open: boolean }
  | { mode: "removeSin", sin: SinData, open: boolean }
  | { mode: "createLicense", sin: SinData, open: boolean }
  | { mode: "editLicense", license: LicenseData, sin: SinData, open: boolean }

export const SinsAndLicensesSection: FC<SinsAndLicensesSectionProps> = ({
  slots,
}) => {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const gearApi = useGearStore()
  const sins = useGearByType<SinData>(GearType.sin)
  const licenses = useGearByType<LicenseData>(GearType.license)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const hasRealSin = sins.some((sin) => sin.rating === "real")

  const handleSaveSin = (sin: SinData) => {
    gearApi.save(sin)
    onDialogClose()
  }

  const handleRemoveSin = (sin: SinData) => {
    gearApi.remove(sin, { removeChildren: true })
    onDialogClose()
  }

  const handleSaveLicense = (license: LicenseData) => {
    gearApi.save(license)
    onDialogClose()
  }

  const handleRemoveLicense = (license: LicenseData) => {
    gearApi.remove(license)
    onDialogClose()
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ mode: "createSin", open: true })}
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
            onClick={() =>
              setDialogState({ mode: "editSin", sin, open: true })}
            onDelete={() => {
              if (hasLicenses) {
                setDialogState({ mode: "removeSin", sin, open: true })
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
                onClick={() => {
                  setDialogState({
                    mode: "editLicense",
                    license,
                    sin,
                    open: true,
                  })
                }}
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
                setDialogState({ mode: "createLicense", sin, open: true })
              }}
              fullWidth
            >
              Add License
            </Button>
          </SinCard>
        )
      })}

      {dialogState?.mode === "createSin" && (
        <SinFormDialog
          open={dialogState.open}
          allowReal={!hasRealSin}
          onSave={handleSaveSin}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "editSin" && (
        <SinFormDialog
          open={dialogState.open}
          sin={dialogState.sin}
          allowReal={!hasRealSin || dialogState.sin.rating === "real"}
          onSave={handleSaveSin}
          onDelete={() => {
            if (
              licenses.some(
                (license) => license.parentId === dialogState.sin.id,
              )
            ) {
              setDialogState({
                mode: "removeSin",
                sin: dialogState.sin,
                open: true,
              })
            } else {
              handleRemoveSin(dialogState.sin)
            }
          }}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "removeSin" && (
        <SinRemoveDialog
          open={dialogState.open}
          sin={dialogState.sin}
          onConfirm={() => handleRemoveSin(dialogState.sin)}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "createLicense" && (
        <LicenseFormDialog
          open={dialogState.open}
          sin={dialogState.sin}
          onSave={handleSaveLicense}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "editLicense" && (
        <LicenseFormDialog
          open={dialogState.open}
          sin={dialogState.sin}
          license={dialogState.license}
          onSave={handleSaveLicense}
          onDelete={() => handleRemoveLicense(dialogState.license)}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </>
  )
}
