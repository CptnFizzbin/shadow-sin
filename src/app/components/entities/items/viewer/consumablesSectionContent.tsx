import type { FC } from "react"

import { ItemCardGrid } from "#app/components/entities/items/card/itemCardGrid.tsx"
import { useDrugFormDialog } from "#app/components/entities/items/types/consumables/dialogs/drugFormDialog.tsx"
import { DrugDataCard } from "#app/components/entities/items/types/consumables/drugDataCard.tsx"
import { useOpenItemDetails } from "#app/hooks/items/useOpenItemDetails.ts"
import type { DrugData } from "#data/items/consumableData.ts"
import { isDrugData } from "#data/items/consumableData.ts"
import { ItemType } from "#data/items/itemType.ts"
import { isNewItem } from "#state/runner/items/items.actions.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

import { useGearListView } from "./gearListFilter.ts"

export const ConsumablesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const consumables = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.consumable })
  const drugFormDialog = useDrugFormDialog()
  const gearListView = useGearListView()

  const drugs = Object.values(consumables).filter(isDrugData)

  const handleEditDrug = async (drug?: DrugData) => {
    const saved = await drugFormDialog.open({ drug })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <ItemCardGrid>
      {gearListView(drugs).map((drug) => (
        <DrugDataCard
          key={drug.id}
          drug={drug}
          onOpen={openItemDetails ? () => openItemDetails(drug.id) : () => handleEditDrug(drug)}
          onEdit={openItemDetails ? () => handleEditDrug(drug) : undefined}
        />
      ))}

      {drugFormDialog.outlet}
    </ItemCardGrid>
  )
}
