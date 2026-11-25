import type { FC } from "react"

import { ItemCardGrid } from "#app/components/entities/items/card/itemCardGrid.tsx"
import { useGearListView } from "#app/components/entities/items/viewer/gearListFilter.ts"
import { useOpenItemDetails } from "#app/hooks/items/useOpenItemDetails.ts"
import type { ImplantData } from "#data/items/implantData.ts"
import { ItemType } from "#data/items/itemType.ts"
import { useGearByType } from "#state/runner/items/gearHooks.ts"
import { isNewItem } from "#state/runner/items/items.actions.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"

import type { UseImplantFormProps } from "./dialogs/implantFormDialog.tsx"
import { useImplantFormDialog } from "./dialogs/implantFormDialog.tsx"
import { ImplantDataCard } from "./implantDataCard.tsx"

export const ImplantItemList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const implants = useGearByType<ImplantData>(ItemType.implant)
  const rootImplants = implants.filter((implant) => !implant.items.parentId)
  const implantFormDialog = useImplantFormDialog()
  const gearListView = useGearListView()

  const handleAddImplant = async (props?: UseImplantFormProps) => {
    const saved = await implantFormDialog.open(props)
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <>
      <ItemCardGrid>
        {gearListView(rootImplants).map((implant) => (
          <ImplantDataCard
            key={implant.id}
            implant={implant}
            onOpen={openItemDetails
              ? () => openItemDetails(implant.id)
              : () => handleAddImplant({ implant })}
            onEdit={openItemDetails ? () => handleAddImplant({ implant }) : undefined}
          />
        ))}
      </ItemCardGrid>

      {implantFormDialog.outlet}
    </>
  )
}
