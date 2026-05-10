import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

import { AdeptPowerListItem } from "./adeptPowerListItem.tsx"
import { usePowerPoints } from "./adeptPowersHooks.ts"
import { selectAllAdeptPowers } from "./adeptPowersSelectors.ts"
import { useAdeptPowerFormDialog } from "./dialogs/adeptPowerFormDialog.tsx"
import { useAdeptPowersStore } from "./useAdeptPowersStore.ts"

export const AdeptPowersList: FC = () => {
  const adeptPowersStore = useAdeptPowersStore()
  const adeptPowers = useSelector(adeptPowersStore, selectAllAdeptPowers)
  const powerPoints = usePowerPoints()
  const adeptPowerFormDialog = useAdeptPowerFormDialog()

  const savePower = (power: AdeptPowerData) => adeptPowersStore.save(power)
  const removePower = (power: AdeptPowerData) => adeptPowersStore.remove(power.id)

  const handleAddPower = async () => {
    const saved = await adeptPowerFormDialog.open()
    if (saved) savePower(saved)
  }

  const handleEditPower = async (power: AdeptPowerData) => {
    const saved = await adeptPowerFormDialog
      .open({ power, onDelete: () => removePower(power) })
    if (saved) savePower(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <PowerPoints value={powerPoints.used} total={powerPoints.max} />

      {adeptPowers.length === 0 && (
        <Typography color="text.secondary">
          No adept powers added yet.
        </Typography>
      )}

      {adeptPowers.map((power) => (
        <AdeptPowerListItem
          key={power.id}
          power={power}
          onClick={() => handleEditPower(power)}
        />
      ))}

      <Button
        startIcon={<RiAddLine />}
        color="secondary"
        variant="outlined"
        onClick={handleAddPower}
      >
        Add Power
      </Button>
    </Stack>
  )
}
