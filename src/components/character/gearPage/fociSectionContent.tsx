import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useFocusFormDialog } from "#/components/items/types/foci/dialogs/focusFormDialog.tsx"
import { FocusItemCard } from "#/components/items/types/foci/focusItemCard.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import type { FocusData } from "#/system/gear/focusData.ts"
import { isFocusData } from "#/system/gear/focusData.ts"
import type { ItemData } from "#/system/itemData.ts"

interface FociSectionContentProps {
  items: ItemData[]
}

export const FociSectionContent: FC<FociSectionContentProps> = ({ items }) => {
  const gearStore = useGearStore()
  const focusFormDialog = useFocusFormDialog()

  const handleEditFocus = async (focus?: FocusData) => {
    const saved = await focusFormDialog.open({ focus })
    if (saved) gearStore.save(saved)
  }

  const handleToggleActivation = (focus: FocusData) => {
    if (!focus.bonded) return
    gearStore.save({ ...focus, equipped: !focus.equipped })
  }

  const foci = items.filter(isFocusData)

  return (
    <Stack sx={{ gap: 1 }}>
      {foci.map((focus) => (
        <FocusItemCard
          key={focus.id}
          focus={focus}
          onEdit={() => handleEditFocus(focus)}
          onRemove={() => gearStore.remove(focus)}
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
