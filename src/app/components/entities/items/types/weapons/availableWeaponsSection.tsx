import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { ItemCardGrid } from "#/app/components/entities/items/card/itemCardGrid.tsx"
import { useGearListView } from "#/app/components/entities/items/viewer/gearListFilter.ts"
import { useOpenItemDetails } from "#/app/hooks/items/useOpenItemDetails.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { WeaponData } from "#/data/items/weaponData.ts"
import { isWeaponData } from "#/data/items/weaponData.ts"
import { useGearByType } from "#/state/runner/items/gearHooks.ts"
import { Icons } from "#/ui/icons/icons.ts"
import { Label } from "#/ui/text/label.tsx"

import { useWeaponAttackDialog } from "./dialogs/weaponAttackDialog.tsx"
import { WeaponDataCard } from "./weaponDataCard.tsx"

/** The weapons the Runner has on hand, Equipped first, each with an Attack button. */
export const AvailableWeaponsSection: FC = () => {
  const weaponAttackDialog = useWeaponAttackDialog()
  const openItemDetails = useOpenItemDetails()
  const gearListView = useGearListView()
  const allWeapons = useGearByType<WeaponData>(ItemType.weapon)

  const weapons = gearListView(allWeapons.filter((weapon) => !weapon.items.parentId && isWeaponData(weapon)))

  return (
    <Stack>
      <Label label="Weapons" />

      {weapons.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          No weapons on hand. Add or unstash weapons from the Gear page.
        </Typography>
      )}

      <ItemCardGrid>
        {weapons.map((weapon) => (
          <WeaponDataCard
            key={weapon.id}
            weapon={weapon}
            onOpen={openItemDetails ? () => openItemDetails(weapon.id) : undefined}
            leftAction={{
              label: "Attack",
              onClick: () => weaponAttackDialog.open({ weapon }),
              icon: <Icons.item.attack />,
            }}
          />
        ))}
      </ItemCardGrid>

      {weaponAttackDialog.outlet}
    </Stack>
  )
}
