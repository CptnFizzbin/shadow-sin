import Stack from "@mui/material/Stack"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { ItemCard } from "#/components/items/card-redesign/itemCard.tsx"
import { useWeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"

export const WeaponsSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const weapons = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.weapon))
  const weaponFormDialog = useWeaponFormDialog()

  const handleEditWeapon = async (weapon: WeaponData) => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {Object.values(weapons).map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: item.id } })}
          onEdit={() => handleEditWeapon(item)}
        />
      ))}

      {weaponFormDialog.dialog}
    </Stack>
  )
}
