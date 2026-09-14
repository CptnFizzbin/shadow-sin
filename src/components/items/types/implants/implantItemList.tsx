import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { useOpenItemDetails } from "#/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { ImplantData } from "#/system/model/items/implantData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

import type { UseImplantFormProps } from "./dialogs/implantFormDialog.tsx"
import { useImplantFormDialog } from "./dialogs/implantFormDialog.tsx"
import { ImplantDataCard } from "./implantDataCard.tsx"

export const ImplantItemList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const implants = useGearByType<ImplantData>(ItemType.implant)
  const rootImplants = implants.filter((implant) => !implant.items.parentId)
  const implantFormDialog = useImplantFormDialog()

  const handleAddImplant = async (props?: UseImplantFormProps) => {
    const saved = await implantFormDialog.open(props)
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <>
      <Stack>
        {rootImplants.map((implant) => (
          <ImplantDataCard
            key={implant.id}
            implant={implant}
            onOpen={openItemDetails
              ? () => openItemDetails(implant.id)
              : () => handleAddImplant({ implant })}
            onEdit={openItemDetails ? () => handleAddImplant({ implant }) : undefined}
          />
        ))}
      </Stack>

      {implantFormDialog.outlet}
    </>
  )
}
