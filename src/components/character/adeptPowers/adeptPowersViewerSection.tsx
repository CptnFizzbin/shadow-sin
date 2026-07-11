import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

import { AdeptPowerListItem } from "./adeptPowerListItem.tsx"
import { usePowerPoints } from "./adeptPowersHooks.ts"
import { selectAllAdeptPowers } from "./adeptPowersSelectors.ts"
import { useAdeptPowerFormDialog } from "./dialogs/adeptPowerFormDialog.tsx"
import { useAdeptPowersStore } from "./useAdeptPowersStore.ts"

export const AdeptPowersViewerSection: FC = () => {
  const adeptPowersStore = useAdeptPowersStore()
  const adeptPowers = useSelector(adeptPowersStore, selectAllAdeptPowers)
  const powerPoints = usePowerPoints()
  const adeptPowerFormDialog = useAdeptPowerFormDialog()

  const handleEditPower = async (power: AdeptPowerData) => {
    const updated = await adeptPowerFormDialog.open({
      power,
      onDelete: () => adeptPowersStore.remove(power.id),
    })
    if (updated) adeptPowersStore.update(updated)
  }

  if (adeptPowers.length === 0) {
    return (
      <Paper sx={{ padding: 1 }}>
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          No adept powers learned
        </Typography>
      </Paper>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <PowerPoints value={powerPoints.used} total={powerPoints.max} />

      <Stack sx={{ gap: 0.5 }}>
        {adeptPowers.map((power) => (
          <AdeptPowerListItem
            key={power.id}
            power={power}
            onClick={() => handleEditPower(power)}
          />
        ))}
      </Stack>

      {adeptPowerFormDialog.dialog}
    </Stack>
  )
}
