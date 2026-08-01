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
import { ImplantItemCard } from "./implantItemCard.tsx"

export const ImplantItemList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
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
            <Stack key={implant.id} sx={{ gap: 1 }}>
              <ImplantItemCard
                implant={implant}
                onOpen={openItemDetails
                  ? () => openItemDetails(implant.id)
                  : () => handleAddImplant({ implant })}
                onEdit={openItemDetails ? () => handleAddImplant({ implant }) : undefined}
              />

              {accessories.length > 0 && (
                <Stack sx={{ gap: 1, pl: 2 }}>
                  {accessories.map((accessory) => (
                    <ImplantItemCard
                      key={accessory.id}
                      implant={accessory}
                      onOpen={openItemDetails
                        ? () => openItemDetails(accessory.id)
                        : () => handleAddImplant({ implant: accessory, parentId: implant.id })}
                      onEdit={openItemDetails
                        ? () => handleAddImplant({ implant: accessory, parentId: implant.id })
                        : undefined}
                    />
                  ))}
                </Stack>
              )}

              <Button
                variant="text"
                color="secondary"
                size="small"
                startIcon={<RiAddLine size={14} />}
                onClick={() => handleAddImplant({ parentId: implant.id })}
                fullWidth
              >
                Add Accessory
              </Button>
            </Stack>
          )
        })}
      </Stack>

      {implantFormDialog.dialog}
    </>
  )
}
