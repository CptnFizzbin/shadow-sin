import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { ArmorItemCard } from "#/components/items/types/armor/armorItemCard.tsx"
import { useArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { useGearByType } from "#/lib/hooks/items/gearHooks.ts"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

export const ArmorList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const armorItems = useGearByType<ArmorData>(ItemType.armor)
  const armorFormDialog = useArmorFormDialog()

  const handleEditArmor = async (armor?: ArmorData) => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {armorItems.map((armor) => (
        <ArmorItemCard
          key={armor.id}
          armor={armor}
          onOpen={() => handleEditArmor(armor)}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditArmor()}
        color="secondary"
        fullWidth
      >
        Add Armor
      </Button>

      {armorFormDialog.dialog}
    </Stack>
  )
}
