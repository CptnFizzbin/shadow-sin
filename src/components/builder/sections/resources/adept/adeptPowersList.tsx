import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { usePowerPoints } from "#/components/character/adeptPowers/adeptPowersHooks.ts"
import { selectAllAdeptPowers } from "#/components/character/adeptPowers/adeptPowersSelectors.ts"
import { useAdeptPowerFormDialog } from "#/components/character/adeptPowers/dialogs/adeptPowerFormDialog.tsx"
import { useAdeptPowersStore } from "#/components/character/adeptPowers/useAdeptPowersStore.ts"
import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

import { AdeptPowersListItem } from "./adeptPowersListItem.tsx"

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
        <AdeptPowersListItem
          key={power.id}
          power={power}
          onEdit={() => handleEditPower(power)}
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
