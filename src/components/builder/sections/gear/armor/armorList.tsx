import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { ArmorItemCard } from "#/components/items/types/armor/armorItemCard.tsx"
import { useArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { useGearByType, useGearStore } from "#/components/items/useGearStore.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

export const ArmorList: FC = () => {
  const gearApi = useGearStore()
  const armorItems = useGearByType<ArmorData>(ItemType.armor)
  const armorFormDialog = useArmorFormDialog()

  const handleEditArmor = async (armor?: ArmorData) => {
    const saved = await armorFormDialog.open({ armor })
    if (saved) gearApi.save(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {armorItems.map((armor) => (
        <ArmorItemCard
          key={armor.id}
          armor={armor}
          onEdit={() => handleEditArmor(armor)}
          onRemove={() => gearApi.remove(armor)}
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
