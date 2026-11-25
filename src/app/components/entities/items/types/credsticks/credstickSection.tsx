import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useEditItemDialog } from "#/app/components/entities/items/actions/useEditItemDialog.tsx"
import type { CredstickData } from "#/data/items/credstickData.ts"
import { ItemType } from "#/data/items/itemType.ts"
import { useGearByType } from "#/state/runner/items/gearHooks.ts"
import { Label } from "#/ui/text/label.tsx"

import { CredstickDataCard } from "./credstickDataCard.tsx"
import { useCredstickDialog } from "./credstickDialog.tsx"

export const CredstickSection: FC = () => {
  const navigate = useNavigate({ from: "/$runnerId" })
  const credsticks = useGearByType<CredstickData>(ItemType.credstick)
  const credstickDialog = useCredstickDialog()
  const editItemDialog = useEditItemDialog()

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
                  onEdit={() => editItemDialog.open(credstick)}
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
      {editItemDialog.outlet}
    </Stack>
  )
}
