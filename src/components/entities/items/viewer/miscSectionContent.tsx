import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useItemFormDialog } from "#/components/entities/items/dialogs/itemFormDialog.tsx"
import { OtherDataCard } from "#/components/entities/items/types/other/otherDataCard.tsx"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { useOpenItemDetails } from "#/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

export const MiscSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
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
          onOpen={openItemDetails ? () => openItemDetails(item.id) : () => handleEditItem(item)}
          onEdit={openItemDetails ? () => handleEditItem(item) : undefined}
        />
      ))}

      {itemFormDialog.outlet}
    </Stack>
  )
}
