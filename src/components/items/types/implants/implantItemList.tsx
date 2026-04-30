import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useGearByType, useGearStore } from "#/components/items/useGearStore.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"

import type { UseImplantFormProps } from "./dialogs/implantFormDialog.tsx"
import { useImplantFormDialog } from "./dialogs/implantFormDialog.tsx"
import { ImplantItemCard } from "./implantItemCard.tsx"

export const ImplantItemList: FC = () => {
  const gearApi = useGearStore()
  const implants = useGearByType<ImplantData>(ItemType.implant)
  const rootImplants = implants.filter((implant) => !implant.parentId)
  const implantFormDialog = useImplantFormDialog()

  const handleAddImplant = async (props?: UseImplantFormProps) => {
    const saved = await implantFormDialog.open(props).result
    if (saved) gearApi.save(saved)
  }

  return (
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
  )
}
