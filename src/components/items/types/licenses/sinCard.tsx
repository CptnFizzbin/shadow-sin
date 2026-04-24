import IconButton from "@mui/material/IconButton"
import { RiDeleteBin6Line } from "@remixicon/react"
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
    <ItemCard onClick={onClick}>
      <ItemCard.Title>{sin.name}</ItemCard.Title>

      {slots?.trailingContent && (
        <ItemCard.Meta type="cost">{slots.trailingContent}</ItemCard.Meta>
      )}

      <ItemCard.Meta type="cost">
        <RatingChip rating={sin.rating} />
      </ItemCard.Meta>

      {onDelete && (
        <ItemCard.Action type="icon">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <RiDeleteBin6Line size={16} />
          </IconButton>
        </ItemCard.Action>
      )}

      {children && <ItemCard.Children>{children}</ItemCard.Children>}
    </ItemCard>
  )
}
