import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useGearByType } from "#/lib/hooks/items/gearHooks.ts"
import { useOpenItemDetails } from "#/lib/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"

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
        <Button
          variant="outlined"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => handleAddImplant()}
          color="secondary"
          fullWidth
        >
          Add Implant
        </Button>

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

      {implantFormDialog.dialog}
    </>
  )
}
