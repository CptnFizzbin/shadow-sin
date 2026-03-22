import { Button } from "@mui/material"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { AdeptPowerFormDialog } from "#/components/AdeptPowers/Dialogs/AdeptPowerFormDialog.tsx"
import {
  useAdeptPowersSlice,
  usePowerPoints,
} from "#/components/Character/Form/Resources/Adept/AdeptPowersHooks.ts"
import { getAdeptPowerBpCost } from "#/components/Character/Form/Resources/Adept/AdeptPowersUtils.ts"
import type { AdeptPowerData } from "#/lib/system/types/magic/adeptPowerData.ts"

type DialogState =
  | null
  | { open: boolean; type: "add" }
  | { open: boolean; type: "edit"; power: AdeptPowerData }

export const AdeptPowersSection: FC = () => {
  const powersSlice = useAdeptPowersSlice()
  const powerPoints = usePowerPoints()
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const onPowerAdd = (power: AdeptPowerData) => {
    powersSlice.update((draft) => {
      draft.push(power)
    })
  }

  const onPowerUpdate = (power: AdeptPowerData) => {
    powersSlice.update((draft) => {
      return draft.map((p) => (p.id === power.id ? power : p))
    })
  }

  const onPowerRemove = (power: AdeptPowerData) => {
    powersSlice.update((draft) => {
      return draft.filter((p) => p.id !== power.id)
    })
  }

  return (
    <Paper sx={{ padding: 1 }}>
      <Stack gap={1}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Adept Powers
        </Typography>

        <Stack>
          <Typography variant="subtitle1" color={"success.main"}>
            {powerPoints.used} / {powerPoints.max} PP
          </Typography>
        </Stack>

        {powersSlice.state.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No adept powers added yet.
          </Typography>
        )}

        {powersSlice.state.map((power) => (
          <Paper key={power.id} sx={{ padding: 1 }}>
            <Stack direction={"row"} gap={1} alignItems={"center"}>
              <Typography flexGrow={1}>{power.name}</Typography>
              <Chip
                label={`Rating: ${power.rating}`}
                variant={"outlined"}
                size={"small"}
              />
              <Typography variant="body2" color="success.main">
                {getAdeptPowerBpCost(power)} PP
              </Typography>
            </Stack>
          </Paper>
        ))}

        <Button
          startIcon={<RiAddLine />}
          color={"secondary"}
          variant={"outlined"}
          onClick={() => setDialogState({ open: true, type: "add" })}
        >
          Add Power
        </Button>
      </Stack>

      {dialogState?.type === "add" && (
        <AdeptPowerFormDialog
          open={dialogState.open}
          onSave={onPowerAdd}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}

      {dialogState?.type === "edit" && (
        <AdeptPowerFormDialog
          open={dialogState.open}
          power={dialogState.power}
          onSave={onPowerUpdate}
          onDelete={() => onPowerRemove(dialogState.power)}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}
    </Paper>
  )
}
