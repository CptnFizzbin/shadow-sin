import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useWeaponFormDialog } from "#/components/entities/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { WeaponDataCard } from "#/components/entities/items/types/weapons/weaponDataCard.tsx"
import { useOpenItemDetails } from "#/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"

export const WeaponsSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const weapons = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.weapon }) as ItemCatalog<WeaponData>
  const weaponFormDialog = useWeaponFormDialog()

  const handleEditWeapon = async (weapon?: WeaponData) => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <Stack>
      {Object.values(weapons).map((item) => (
        <WeaponDataCard
          key={item.id}
          weapon={item}
          onOpen={openItemDetails ? () => openItemDetails(item.id) : () => handleEditWeapon(item)}
          onEdit={openItemDetails ? () => handleEditWeapon(item) : undefined}
        />
      ))}

      {weaponFormDialog.outlet}
    </Stack>
  )
}
