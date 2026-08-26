import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { ArmorDataCard } from "#/components/items/types/armor/armorDataCard.tsx"
import { useArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

export const ArmorList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const armorItems = useGearByType<ArmorData>(ItemType.armor)
  const armorFormDialog = useArmorFormDialog()

  const handleEditArmor = async (armor?: ArmorData) => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <Stack>
      {armorItems.map((armor) => (
        <ArmorDataCard
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

      {armorFormDialog.outlet}
    </Stack>
  )
}
