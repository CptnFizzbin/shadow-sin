import type { FC } from "react"

import { ItemCardGrid } from "#/app/components/entities/items/card/itemCardGrid.tsx"
import { ArmorDataCard } from "#/app/components/entities/items/types/armor/armorDataCard.tsx"
import { useArmorFormDialog } from "#/app/components/entities/items/types/armor/dialogs/armorFormDialog.tsx"
import { useOpenItemDetails } from "#/app/hooks/items/useOpenItemDetails.ts"
import type { ArmorData } from "#/data/items/armorData.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { ItemCatalog } from "#/data/items/itemUtils.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { useGearListView } from "./gearListFilter.ts"

export const ArmorSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const armorItems = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.armor }) as ItemCatalog<ArmorData>
  const armorFormDialog = useArmorFormDialog()
  const gearListView = useGearListView()

  const handleEditArmor = async (armor?: ArmorData) => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <ItemCardGrid>
      {gearListView(Object.values(armorItems)).map((item) => (
        <ArmorDataCard
          key={item.id}
          armor={item}
          onOpen={openItemDetails ? () => openItemDetails(item.id) : () => handleEditArmor(item)}
          onEdit={openItemDetails ? () => handleEditArmor(item) : undefined}
        />
      ))}

      {armorFormDialog.outlet}
    </ItemCardGrid>
  )
}
