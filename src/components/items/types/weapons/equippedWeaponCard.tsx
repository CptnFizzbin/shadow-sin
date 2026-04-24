import type { FC } from "react"
import { useState } from "react"

import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { WeaponAttackDialog } from "#/components/items/types/weapons/dialogs/weaponAttackDialog.tsx"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData, WeaponType } from "#/system/gear/weaponData.ts"

interface EquippedWeaponCardProps {
  weapon: WeaponData
}

export const EquippedWeaponCard: FC<EquippedWeaponCardProps> = ({ weapon }) => {
  const [attackOpen, setAttackOpen] = useState(false)

  return (
    <>
      <ItemCard>
        <ItemCard.Title>{weapon.name}</ItemCard.Title>

        {weapon.ap && (
          <ItemCard.Meta type="stat">
            <ItemStatChip label={`AP: ${weapon.ap}`} />
          </ItemCard.Meta>
        )}

        {weapon.dmg && (
          <ItemCard.Meta type="stat">
            <ItemStatChip label={`DV: ${weapon.dmg}`} color="secondary" />
          </ItemCard.Meta>
        )}

        {weapon.skill && (
          <ItemCard.Meta type="stat">
            <ItemStatChip label={weapon.skill} color="primary" />
          </ItemCard.Meta>
        )}

        {weapon.weaponType === WeaponType.melee && (
          <ItemCard.Meta type="stat">
            <ItemStatChip label="Melee" />
          </ItemCard.Meta>
        )}

        {isFirearmData(weapon) && (
          <ItemCard.Meta type="stat">
            <ItemStatChip label={weapon.firearmType} />
            {weapon.firemodes.length > 0 && (
              <ItemStatChip label={weapon.firemodes.join("/")} />
            )}
            <ItemStatChip
              label={`Ammo: ${weapon.ammo.remaining}/${weapon.ammo.size}`}
            />
          </ItemCard.Meta>
        )}

        <ItemCard.Action type="button" onClick={() => setAttackOpen(true)}>
          Attack
        </ItemCard.Action>
      </ItemCard>

      <WeaponAttackDialog
        weapon={weapon}
        open={attackOpen}
        onClose={() => setAttackOpen(false)}
      />
    </>
  )
}
