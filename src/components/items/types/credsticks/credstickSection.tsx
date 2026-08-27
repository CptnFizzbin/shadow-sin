import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { ItemType } from "#/system/itemType.ts"

import { CredstickDataCard } from "./credstickDataCard.tsx"
import { useCredstickDialog } from "./credstickDialog.tsx"

export const CredstickSection: FC = () => {
  const navigate = useNavigate({ from: "/$runnerId" })
  const credsticks = useGearByType<CredstickData>(ItemType.credstick)
  const credstickDialog = useCredstickDialog()

  return (

    <Stack>
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
                <CredstickDataCard
                  key={credstick.id}
                  credstick={credstick}
                  onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: credstick.id } })}
                  onEdit={() => credstickDialog.open({ mode: "edit", credstick })}
                />
              ))}
            </Stack>
          )}

      <Stack direction="row">
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

      {credstickDialog.outlet}
    </Stack>
  )
}
