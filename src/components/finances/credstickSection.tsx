import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { CredstickCard } from "#/components/finances/credstickCard.tsx"
import type { CredstickDialogMode } from "#/components/finances/dialogs/credstickDialog.tsx"
import { CredstickDialog } from "#/components/finances/dialogs/credstickDialog.tsx"
import { useGearByType } from "#/components/gear/useGearApi.ts"
import type { CredstickData } from "#/lib/system/gear/credstickData.ts"
import { GearType } from "#/lib/system/gearType.ts"

type DialogState = { open: boolean, mode: CredstickDialogMode, credstick?: CredstickData } | null

export const CredstickSection: FC = () => {
  const credsticks = useGearByType<CredstickData>(GearType.credstick)
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const handleCardClick = (credstick: CredstickData) => {
    setDialogState({ open: true, mode: "edit", credstick })
  }

  return (
    <>
      <Stack gap={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2">Credsticks</Typography>
          <Stack direction="row" gap={0.5}>
            <Button
              size="small"
              startIcon={<RiAddLine size={14} />}
              onClick={() => setDialogState({ open: true, mode: "add" })}
            >
              Add
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RiAddLine size={14} />}
              onClick={() => setDialogState({ open: true, mode: "add-certified" })}
            >
              Certify (25¥)
            </Button>
          </Stack>
        </Stack>

        {credsticks.length === 0
          ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                No credsticks
              </Typography>
            )
          : (
              <Stack gap={0.5}>
                {credsticks.map((credstick) => (
                  <CredstickCard
                    key={credstick.id}
                    credstick={credstick}
                    onClick={handleCardClick}
                  />
                ))}
              </Stack>
            )}
      </Stack>

      {dialogState !== null && (
        <CredstickDialog
          open={dialogState.open}
          mode={dialogState.mode}
          credstick={dialogState.credstick}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}
    </>
  )
}
