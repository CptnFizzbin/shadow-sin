import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useWeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import { WeaponDataCard } from "#/components/items/types/weapons/weaponDataCard.tsx"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"

export const WeaponsSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const weapons = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.weapon }) as ItemCatalog<WeaponData>
  const weaponFormDialog = useWeaponFormDialog()

  const handleEditWeapon = async (weapon?: WeaponData) => {
    const saved = await weaponFormDialog.open({ weapon })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <Stack>
      {Object.values(weapons).map((item) => (
        <WeaponDataCard
          key={item.id}
          weapon={item}
          onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: item.id } })}
          onEdit={() => handleEditWeapon(item)}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditWeapon()}
        color="secondary"
        fullWidth
      >
        Add Weapon
      </Button>

      {weaponFormDialog.outlet}
    </Stack>
  )
}
