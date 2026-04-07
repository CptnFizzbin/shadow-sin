import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import { useGearPurchase } from "#/components/gear/useGearPurchase.ts"
import { LicenseFormDialog } from "#/components/licenses/dialogs/licenseFormDialog.tsx"
import { SinFormDialog } from "#/components/licenses/dialogs/sinFormDialog.tsx"
import type { LicenseData } from "#/lib/system/gear/licenseData.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"

type LicensesDialogState =
  | null
  | { type: "sin", open: boolean }
  | { type: "license", sin: SinData, open: boolean }

interface LicensesSectionContentProps {
  sins: SinData[]
  getLicenses: (sinId: string) => LicenseData[]
}

export const LicensesSectionContent: FC<LicensesSectionContentProps> = ({
  sins,
  getLicenses,
}) => {
  const { acquire, purchase } = useGearPurchase()
  const [dialogState, setDialogState] = useState<LicensesDialogState>(null)

  const hasRealSin = sins.some((sin) => sin.rating === "real")
  const closeDialog = () => setDialogState((prev) => prev && { ...prev, open: false })

  return (
    <Stack gap={1}>
      {sins.map((sin) => (
        <GearViewItem
          key={sin.id}
          item={sin}
          subItems={getLicenses(sin.id)}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ type: "sin", open: true })}
        color="secondary"
        fullWidth
      >
        Add SIN
      </Button>

      {dialogState?.type === "sin" && (
        <SinFormDialog
          open={dialogState.open}
          allowReal={!hasRealSin}
          onAcquire={(sin: SinData) => acquire(sin, closeDialog)}
          onPurchase={(sin: SinData) => purchase(sin, sin.cost ?? 0, closeDialog)}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}

      {dialogState?.type === "license" && (
        <LicenseFormDialog
          open={dialogState.open}
          sin={dialogState.sin}
          onAcquire={(license: LicenseData) => acquire(license, closeDialog)}
          onPurchase={(license: LicenseData) => purchase(license, license.cost ?? 0, closeDialog)}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
