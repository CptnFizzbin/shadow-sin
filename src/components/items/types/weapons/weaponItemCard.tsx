import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { EquippedChip } from "#/components/items/equippedChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import { GenericItemCard } from "#/components/items/genericItemCard.tsx"
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

  return (
    <ItemCard onClick={onEdit}>
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
          {weapon.firemodes.length > 0 && (
            <ItemStatChip label={weapon.firemodes.join("/")} />
          )}
        </ItemCard.Meta>
      )}

      {availability && (
        <ItemCard.Meta type="stat">
          <AvailabilityChip
            availability={availability}
            color={availability.rating > GearMaxAvailability ? "warning" : undefined}
          />
        </ItemCard.Meta>
      )}

      {source && (
        <ItemCard.Meta type="source">
          <ItemStatChip label={`${source.book} p.${source.page}`} />
        </ItemCard.Meta>
      )}

      <ItemCard.Action type="icon" color="error" onClick={onRemove}>
        <RiDeleteBin6Line size={16} />
      </ItemCard.Action>

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
    </ItemCard>
  )
}
