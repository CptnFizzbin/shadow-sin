import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useLicenseFormDialog } from "#/components/items/types/licenses/dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "#/components/items/types/licenses/dialogs/sinFormDialog.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
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
    <Stack sx={{ gap: 1 }}>
      {sins.map((sin) => (
        <Stack key={sin.id} sx={{ gap: 1 }}>
          <GearViewItem
            item={sin}
            subItems={getLicenses(sin.id)}
            onEdit={() => handleEditSin(sin)}
            onRemove={() => gearStore.remove(sin, { removeChildren: true })}
            getSubItemCallbacks={(licenseId) => {
              const license = getLicenses(sin.id).find((l) => l.id === licenseId)
              return {
                onEdit: license
                  ? () => handleEditLicense(sin, license)
                  : undefined,
                onRemove: license ? () => gearStore.remove(license) : undefined,
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
