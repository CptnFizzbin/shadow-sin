import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { CredstickCard } from "#/components/items/types/credsticks/credstickCard.tsx"
import { useCredstickDialog } from "#/components/items/types/credsticks/credstickDialog.tsx"
import { useGearByType } from "#/components/items/useGearStore.ts"
import { Label } from "#/components/ui/text/label.tsx"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { ItemType } from "#/system/itemType.ts"

export const CredstickSection: FC = () => {
  const credsticks = useGearByType<CredstickData>(ItemType.credstick)
  const credstickDialog = useCredstickDialog()

  const handleCardClick = (credstick: CredstickData) => {
    credstickDialog.open({ mode: "edit", credstick })
  }

  return (

    <Stack sx={{ gap: 1 }}>
      <Label label="Credsticks" />

      {credsticks.length === 0
        ? (
            <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
              No credsticks
            </Typography>
          )
        : (
            <Stack sx={{ gap: 0.5 }}>
              {credsticks.map((credstick) => (
                <CredstickCard
                  key={credstick.id}
                  credstick={credstick}
                  onClick={handleCardClick}
                />
              ))}
            </Stack>
          )}

      <Stack direction="row" sx={{ gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RiAddLine size={14} />}
          onClick={() => credstickDialog.open({ mode: "add-certified" })}
          fullWidth
        >
          Create
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RiAddLine size={14} />}
          onClick={() => credstickDialog.open({ mode: "add" })}
          fullWidth
        >
          Receive
        </Button>
      </Stack>
    </Stack>
  )
}
