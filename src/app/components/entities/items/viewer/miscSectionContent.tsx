import type { FC } from "react"

import { ItemCardGrid } from "#app/components/entities/items/card/itemCardGrid.tsx"
import { useItemFormDialog } from "#app/components/entities/items/dialogs/itemFormDialog.tsx"
import { OtherDataCard } from "#app/components/entities/items/types/other/otherDataCard.tsx"
import { useOpenItemDetails } from "#app/hooks/items/useOpenItemDetails.ts"
import type { ItemData } from "#data/items/itemData.ts"
import { ItemType } from "#data/items/itemType.ts"
import { useGearByType } from "#state/runner/items/gearHooks.ts"
import { isNewItem } from "#state/runner/items/items.actions.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"

import { useGearListView } from "./gearListFilter.ts"

export const MiscSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const items = useGearByType<ItemData>(ItemType.other)
  const itemFormDialog = useItemFormDialog()
  const gearListView = useGearListView()

  const rootItems = items.filter((item) => !item.items.parentId)

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.item.addItem(item) : Actions.item.setItem(item))

  const handleEditItem = async (item?: ItemData) => {
    const saved = await itemFormDialog.open({ item, itemType: ItemType.other, label: "Item" })
    if (saved) saveItem(saved)
  }

  return (
    <ItemCardGrid>
      {gearListView(rootItems).map((item) => (
        <OtherDataCard
          key={item.id}
          item={item}
          onOpen={openItemDetails ? () => openItemDetails(item.id) : () => handleEditItem(item)}
          onEdit={openItemDetails ? () => handleEditItem(item) : undefined}
        />
      ))}

      {itemFormDialog.outlet}
    </ItemCardGrid>
  )
}
