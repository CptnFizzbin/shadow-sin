import type { FC } from "react"

import { ItemCardGrid } from "#app/components/entities/items/card/itemCardGrid.tsx"
import { useFocusFormDialog } from "#app/components/entities/items/types/magical/dialogs/focusFormDialog.tsx"
import { FocusDataCard } from "#app/components/entities/items/types/magical/focusDataCard.tsx"
import { useOpenItemDetails } from "#app/hooks/items/useOpenItemDetails.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { FocusData } from "#data/items/magicalData.ts"
import { isFocusData } from "#data/items/magicalData.ts"
import { isNewItem } from "#state/runner/items/items.actions.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

import { useGearListView } from "./gearListFilter.ts"

export const MagicalSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const magicalItems = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.magical })
  const focusFormDialog = useFocusFormDialog()
  const gearListView = useGearListView()

  const foci = Object.values(magicalItems).filter(isFocusData)

  const handleEditFocus = async (focus?: FocusData) => {
    const saved = await focusFormDialog.open({ focus })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <ItemCardGrid>
      {gearListView(foci).map((focus) => (
        <FocusDataCard
          key={focus.id}
          focus={focus}
          onOpen={openItemDetails ? () => openItemDetails(focus.id) : () => handleEditFocus(focus)}
          onEdit={openItemDetails ? () => handleEditFocus(focus) : undefined}
        />
      ))}

      {focusFormDialog.outlet}
    </ItemCardGrid>
  )
}
