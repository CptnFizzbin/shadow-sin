import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/items/dialogs/itemFormDialog.tsx"
import { OtherDataCard } from "#/components/items/types/other/otherDataCard.tsx"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export const MiscSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const items = useGearByType<ItemData>(ItemType.other)
  const itemFormDialog = useItemFormDialog()

  const rootItems = items.filter((item) => !item.items.parentId)

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.item.addItem(item) : Actions.item.setItem(item))

  const handleEditItem = async (item?: ItemData) => {
    const saved = await itemFormDialog.open({ item, itemType: ItemType.other, label: "Item" })
    if (saved) saveItem(saved)
  }

  return (
    <Stack>
      {rootItems.map((item) => (
        <OtherDataCard
          key={item.id}
          item={item}
          onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: item.id } })}
          onEdit={() => handleEditItem(item)}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditItem()}
        color="secondary"
        fullWidth
      >
        Add Item
      </Button>

      {itemFormDialog.dialog}
    </Stack>
  )
}
