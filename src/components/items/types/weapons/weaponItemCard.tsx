import Typography from "@mui/material/Typography"
import { RiFileShieldLine } from "@remixicon/react"
import type { FC } from "react"

import { GearItemCard } from "#/components/items/card/gearItemCard.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { EquippedChip } from "#/components/items/equippedChip.tsx"
import { GenericItemCard } from "#/components/items/genericItemCard.tsx"
import { useQuickBuyLicenseAction } from "#/components/items/types/licenses/useQuickBuyLicenseAction.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"

interface WeaponItemCardProps {
  weapon: WeaponData
  accessories?: ItemData[]
  onEdit: () => void
  onRemove: () => void
  onAddAccessory?: () => void
  onEditAccessory?: (item: ItemData) => void
  onRemoveAccessory?: (item: ItemData) => void
}

export const WeaponItemCard: FC<WeaponItemCardProps> = ({
  weapon,
  accessories = [],
  onEdit,
  onRemove,
  onAddAccessory,
  onEditAccessory,
  onRemoveAccessory,
}) => {
  const { availability, source } = weapon
  const licenseQuickBuy = useQuickBuyLicenseAction(weapon)

  return (
    <>
      <GearItemCard
        availability={availability}
        source={source}
        onEdit={onEdit}
        onRemove={onRemove}
      >
        <ItemCard.Title>{weapon.name}</ItemCard.Title>

        {weapon.equipped && (
          <ItemCard.Meta type="cost">
            <EquippedChip />
          </ItemCard.Meta>
        )}

        {weapon.cost !== undefined && (
          <ItemCard.Meta type="cost">
            <Typography sx={{ fontSize: "0.875rem" }}>
              <Nuyen amount={weapon.cost} />
            </Typography>
          </ItemCard.Meta>
        )}

        <ItemCard.Meta type="stat">
          <ItemStatChip label={`DV: ${weapon.dmg}`} color="secondary" />
          {weapon.ap !== undefined && <ItemStatChip label={`AP: ${weapon.ap}`} />}
          <ItemStatChip label={weapon.skill} color="primary" />
        </ItemCard.Meta>

        {isFirearmData(weapon) && (
          <ItemCard.Meta type="stat">
            <ItemStatChip label={weapon.firearmType} />
            {(weapon.firemodes?.length ?? 0) > 0 && (
              <ItemStatChip label={weapon.firemodes!.join("/")} />
            )}
          </ItemCard.Meta>
        )}

        {onAddAccessory && (
          <ItemCard.AddChildButton onClick={onAddAccessory}>
            Add Accessory
          </ItemCard.AddChildButton>
        )}

        {accessories.length > 0 && (
          <ItemCard.Children>
            {accessories.map((accessory) => (
              <GenericItemCard
                key={accessory.id}
                item={accessory}
                variant="borderless"
                onEdit={() => onEditAccessory?.(accessory)}
                onRemove={() => onRemoveAccessory?.(accessory)}
              />
            ))}
          </ItemCard.Children>
        )}

        {licenseQuickBuy.eligible && (
          <ItemCard.Action type="icon" aria-label="Buy License" onClick={licenseQuickBuy.open}>
            <RiFileShieldLine size={16} />
          </ItemCard.Action>
        )}
      </GearItemCard>

      {licenseQuickBuy.dialog}
    </>
  )
}
