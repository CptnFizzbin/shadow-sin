import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ArmorDataCard } from "#/components/items/types/armor/armorDataCard.tsx"
import { useArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { useOpenItemDetails } from "#/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"

export const ArmorSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const armorItems = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.armor }) as ItemCatalog<ArmorData>
  const armorFormDialog = useArmorFormDialog()

  const handleEditArmor = async (armor?: ArmorData) => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <Stack>
      {Object.values(armorItems).map((item) => (
        <ArmorDataCard
          key={item.id}
          armor={item}
          onOpen={openItemDetails ? () => openItemDetails(item.id) : () => handleEditArmor(item)}
          onEdit={openItemDetails ? () => handleEditArmor(item) : undefined}
        />
      ))}

      {armorFormDialog.outlet}
    </Stack>
  )
}
