import { useStore } from "@tanstack/react-store"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ItemList } from "#/components/items/card/itemList.tsx"
import { SpiritItemCard } from "#/components/character/spirits/SpiritItemCard.tsx"
import { TraditionDisplay } from "#/components/character/spirits/TraditionDisplay.tsx"
import { useSpiritsStore } from "#/components/character/spirits/useSpiritsStore.ts"
import { selectAllSpirits } from "#/components/character/spirits/spiritsSelectors.ts"
import { useSpiritFormDialog } from "#/components/character/spirits/dialogs/SpiritFormDialog.tsx"
import type { SpiritData } from "#/system/magic/spiritData.ts"

export const SpiritList: FC = () => {
  const spiritsStore = useSpiritsStore()
  const spirits = useStore(spiritsStore, selectAllSpirits)
  const spiritForm = useSpiritFormDialog()

  const handleAdd = async () => {
    const result = await spiritForm.open().result()
    if (result) spiritsStore.save(result)
  }

  const handleEdit = async (spirit: SpiritData) => {
    const result = await spiritForm.open(spirit).result()
    if (result) spiritsStore.save(result)
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <TraditionDisplay />

      <Stack sx={{ gap: 1 }}>
        <ItemList.AddItemButton onClick={handleAdd}>Summon Spirit</ItemList.AddItemButton>
        {spirits.map((spirit) => (
          <SpiritItemCard
            key={spirit.id}
            spirit={spirit}
            onEdit={() => handleEdit(spirit)}
            onRemove={() => spiritsStore.remove(spirit.id)}
          />
        ))}
      </Stack>
    </Stack>
  )
}
