import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { useGearByType } from "#/lib/hooks/items/gearHooks.ts"
import { useOpenItemDetails } from "#/lib/hooks/items/useOpenItemDetails.ts"
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

export const SinsAndLicensesSection: FC = () => {
  const confirmDialog = useConfirmDialog()
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
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

        return (
          <Stack key={sin.id} sx={{ gap: 1 }}>
            <SinCard
              sin={sin}
              onOpen={openItemDetails ? () => openItemDetails(sin.id) : () => handleEditSin(sin)}
              onEdit={openItemDetails ? () => handleEditSin(sin) : undefined}
            />

            {sinLicenses.length > 0 && (
              <Stack sx={{ gap: 1, pl: 2 }}>
                {sinLicenses.map((license) => (
                  <LicenseCard
                    key={license.id}
                    license={license}
                    onOpen={openItemDetails
                      ? () => openItemDetails(license.id)
                      : () => handleEditLicense(sin, license)}
                    onEdit={openItemDetails ? () => handleEditLicense(sin, license) : undefined}
                  />
                ))}
              </Stack>
            )}

            <Button
              variant="text"
              color="secondary"
              size="small"
              startIcon={<RiAddLine size={14} />}
              onClick={() => handleEditLicense(sin)}
              fullWidth
            >
              Add License
            </Button>
          </Stack>
        )
      })}

      {confirmDialog.dialog}
      {sinFormDialog.dialog}
      {licenseFormDialog.dialog}
    </>
  )
}
