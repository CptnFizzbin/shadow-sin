import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useLicenseFormDialog } from "#/components/items/types/licenses/dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "#/components/items/types/licenses/dialogs/sinFormDialog.tsx"
import { LicenseDataCard } from "#/components/items/types/licenses/licenseDataCard.tsx"
import { SinDataCard } from "#/components/items/types/licenses/sinDataCard.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"

export const LicensesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const sins = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.sin))
  const licenses = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.license))
  const sinFormDialog = useSinFormDialog()
  const licenseFormDialog = useLicenseFormDialog()

  const saveItem = (item: SinData | LicenseData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))

  const handleEditSin = async (sin?: SinData) => {
    const saved = await sinFormDialog.open({ sin })
    if (saved) saveItem(saved)
  }

  const handleEditLicense = async (sin?: SinData, license?: LicenseData) => {
    const saved = await licenseFormDialog.open({ sin, license })
    if (saved) saveItem(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {Object.values(sins).map((sin) => {
        const sinLicenses = Object.values(licenses).filter((license) => license.parentId === sin.id)

        return (
          <Stack key={sin.id} sx={{ gap: 1 }}>
            <SinDataCard
              sin={sin}
              onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: sin.id } })}
              onEdit={() => handleEditSin(sin)}
            />

            {sinLicenses.length > 0 && (
              <Stack sx={{ gap: 1, pl: 2 }}>
                {sinLicenses.map((license) => (
                  <LicenseDataCard
                    key={license.id}
                    license={license}
                    onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: license.id } })}
                    onEdit={() => handleEditLicense(sin, license)}
                  />
                ))}
              </Stack>
            )}

            <Button
              variant="outlined"
              size="small"
              startIcon={<RiAddLine size={14} />}
              onClick={() => handleEditLicense(sin)}
              color="secondary"
              fullWidth
            >
              Add License to {sin.name}
            </Button>
          </Stack>
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditSin()}
        color="secondary"
        fullWidth
      >
        Add SIN
      </Button>

      {sinFormDialog.dialog}
      {licenseFormDialog.dialog}
    </Stack>
  )
}
