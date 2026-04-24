import IconButton from "@mui/material/IconButton"
import { RiDeleteBin6Line } from "@remixicon/react"
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
    <ItemCard onClick={onClick}>
      <ItemCard.Title>{license.name}</ItemCard.Title>

      {slots?.trailingContent && (
        <ItemCard.Meta type="cost">{slots.trailingContent}</ItemCard.Meta>
      )}

      <ItemCard.Meta type="cost">
        <RatingChip rating={license.rating} />
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
    </ItemCard>
  )
}
