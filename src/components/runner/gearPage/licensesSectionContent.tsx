import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useLicenseFormDialog } from "#/components/items/types/licenses/dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "#/components/items/types/licenses/dialogs/sinFormDialog.tsx"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"

import { GearViewItem } from "./gearViewItem.tsx"

interface LicensesSectionContentProps {
  sins: SinData[]
  getLicenses: (sinId: string) => LicenseData[]
}

export const LicensesSectionContent: FC<LicensesSectionContentProps> = ({
  sins,
  getLicenses,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const sinFormDialog = useSinFormDialog()
  const licenseFormDialog = useLicenseFormDialog()

  const saveItem = (item: SinData | LicenseData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))

  const handleEditSin = async (sin?: SinData) => {
    const saved = await sinFormDialog.open({ sin })
    if (saved) saveItem(saved)
  }

  const handleEditLicense = async (sin: SinData, license?: LicenseData) => {
    const saved = await licenseFormDialog.open({ sin, license })
    if (saved) saveItem(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {sins.map((sin) => (
        <Stack key={sin.id} sx={{ gap: 1 }}>
          <GearViewItem
            item={sin}
            subItems={getLicenses(sin.id)}
            onEdit={() => handleEditSin(sin)}
            onRemove={() => dispatch(Actions.gear.removeItem({ id: sin.id, removeChildren: true }))}
            getSubItemCallbacks={(licenseId) => {
              const license = getLicenses(sin.id).find((l) => l.id === licenseId)
              return {
                onEdit: license
                  ? () => handleEditLicense(sin, license)
                  : undefined,
                onRemove: license ? () => dispatch(Actions.gear.licenses.destroy(license.id)) : undefined,
              }
            }}
          />
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
      ))}

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
