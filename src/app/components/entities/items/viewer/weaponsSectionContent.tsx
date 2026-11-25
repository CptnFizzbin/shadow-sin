import type { FC } from "react"

import { ItemCardGrid } from "#app/components/entities/items/card/itemCardGrid.tsx"
import { useWeaponFormDialog } from "#app/components/entities/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { WeaponDataCard } from "#app/components/entities/items/types/weapons/weaponDataCard.tsx"
import { useOpenItemDetails } from "#app/hooks/items/useOpenItemDetails.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { ItemCatalog } from "#data/items/itemUtils.ts"
import type { WeaponData } from "#data/items/weaponData.ts"
import { isNewItem } from "#state/runner/items/items.actions.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

import { useGearListView } from "./gearListFilter.ts"

export const WeaponsSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const weapons = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.weapon }) as ItemCatalog<WeaponData>
  const weaponFormDialog = useWeaponFormDialog()
  const gearListView = useGearListView()

  const handleEditWeapon = async (weapon?: WeaponData) => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <ItemCardGrid>
      {gearListView(Object.values(weapons)).map((item) => (
        <WeaponDataCard
          key={item.id}
          weapon={item}
          onOpen={openItemDetails ? () => openItemDetails(item.id) : () => handleEditWeapon(item)}
          onEdit={openItemDetails ? () => handleEditWeapon(item) : undefined}
        />
      ))}

      {weaponFormDialog.outlet}
    </ItemCardGrid>
  )
}
