import { RiDeleteBin6Line, RiEdit2Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { RatingChip } from "#/components/ui/ratingChip.tsx"
import type { LicenseData } from "#/system/gear/licenseData.ts"

interface LicenseCardSlots {
  trailingContent?: ReactNode
}

interface LicenseCardProps {
  license: LicenseData
  slots?: LicenseCardSlots
  onClick?: () => void
  onDelete?: () => void
}

export const LicenseCard: FC<LicenseCardProps> = ({
  license,
  slots,
  onClick,
  onDelete,
}) => {
  return (
    <ItemCard>
      <ItemCard.Title>{license.name}</ItemCard.Title>

      {slots?.trailingContent && (
        <ItemCard.Meta type="cost">{slots.trailingContent}</ItemCard.Meta>
      )}

      <ItemCard.Meta type="cost">
        <RatingChip rating={license.rating} />
      </ItemCard.Meta>

      {onClick && (
        <ItemCard.Action type="icon" aria-label="Edit" onClick={onClick}>
          <RiEdit2Line size={16} />
        </ItemCard.Action>
      )}

      {onDelete && (
        <ItemCard.Action type="icon" color="error" aria-label="Remove" onClick={onDelete}>
          <RiDeleteBin6Line size={16} />
        </ItemCard.Action>
      )}
    </ItemCard>
  )
}
