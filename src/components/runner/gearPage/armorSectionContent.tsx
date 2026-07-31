import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { ArmorItemCard } from "#/components/items/types/armor/armorItemCard.tsx"
import { useArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

export const ArmorSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const armorItems = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.armor))
  const armorFormDialog = useArmorFormDialog()

  const handleEditArmor = async (armor?: ArmorData) => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {Object.values(armorItems).map((item) => (
        <ArmorItemCard key={item.id} armor={item} onOpen={() => handleEditArmor(item)} />
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
