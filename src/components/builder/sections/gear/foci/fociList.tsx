import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useFocusFormDialog } from "#/components/items/types/foci/dialogs/focusFormDialog.tsx"
import { FocusItemCard } from "#/components/items/types/foci/focusItemCard.tsx"
import { useGearByType, useGearStore } from "#/components/items/useGearStore.ts"
import type { FocusData } from "#/system/gear/focusData.ts"
import { ItemType } from "#/system/itemType.ts"

export const FociList: FC = () => {
  const gearApi = useGearStore()
  const focusItems = useGearByType<FocusData>(ItemType.focus)
  const focusFormDialog = useFocusFormDialog()

  const handleEditFocus = async (focus?: FocusData) => {
    const saved = await focusFormDialog.open({ focus })
    if (saved) gearApi.save(saved)
  }

  const handleToggleActivation = (focus: FocusData) => {
    if (!focus.bonded) return
    gearApi.save({ ...focus, equipped: !focus.equipped })
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {focusItems.map((focus) => (
        <FocusItemCard
          key={focus.id}
          focus={focus}
          onEdit={() => handleEditFocus(focus)}
          onRemove={() => gearApi.remove(focus)}
          onToggleActivation={() => handleToggleActivation(focus)}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditFocus()}
        color="secondary"
        fullWidth
      >
        Add Focus
      </Button>
    </Stack>
  )
}
