import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useGearByType } from "#/components/items/gearHooks.ts"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"

import type { UseImplantFormProps } from "./dialogs/implantFormDialog.tsx"
import { useImplantFormDialog } from "./dialogs/implantFormDialog.tsx"
import { ImplantItemCard } from "./implantItemCard.tsx"

export const ImplantItemList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const implants = useGearByType<ImplantData>(ItemType.implant)
  const rootImplants = implants.filter((implant) => !implant.parentId)
  const implantFormDialog = useImplantFormDialog()

  const handleAddImplant = async (props?: UseImplantFormProps) => {
    const saved = await implantFormDialog.open(props)
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <>
      <Stack sx={{ gap: 1 }}>
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

        {rootImplants.map((implant) => {
          const accessories = implants.filter((i) => i.parentId === implant.id)

          return (
            <ImplantItemCard
              key={implant.id}
              implant={implant}
              onAddAccessory={() => handleAddImplant({ parentId: implant.id })}
              accessories={accessories}
            />
          )
        })}
      </Stack>

      {implantFormDialog.dialog}
    </>
  )
}
