import { RiDeleteBin6Line, RiEdit2Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { RatingChip } from "#/components/ui/ratingChip.tsx"
import type { SinData } from "#/system/gear/sinData.ts"

interface SinCardSlots {
  trailingContent?: ReactNode
}

interface SinCardProps {
  sin: SinData
  slots?: SinCardSlots
  onClick?: () => void
  onDelete?: () => void
  children?: ReactNode
}

export const SinCard: FC<SinCardProps> = ({
  sin,
  slots,
  onClick,
  onDelete,
  children,
}) => {
  return (
    <ItemCard>
      <ItemCard.Title>{sin.name}</ItemCard.Title>

      {slots?.trailingContent && (
        <ItemCard.Meta type="cost">{slots.trailingContent}</ItemCard.Meta>
      )}

      <ItemCard.Meta type="cost">
        <RatingChip rating={sin.rating} />
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

      {children && <ItemCard.Children>{children}</ItemCard.Children>}
    </ItemCard>
  )
}
