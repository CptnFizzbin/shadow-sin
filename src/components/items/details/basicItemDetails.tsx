import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { Children } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { getEffectLabel } from "#/components/system/gameEffects/gameEffectsSummary.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import { isElementType } from "#/lib/slotUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import { isEquipped, isStashed } from "#/system/items/itemUtils.ts"
import { formatBookRef } from "#/system/sourceData.ts"

import { ItemDetailsSlot } from "./itemDetailsSlot.tsx"

export interface BasicItemDetailsProps {
  item: ItemData
  type?: ReactNode
  /** When provided, adds a persistent "Edit" action that opens the item's edit dialog. */
  onEdit?: () => void
  /** When provided, adds a persistent "Remove" action. */
  onRemove?: () => void
  children?: ReactNode
}

/**
 * Generic ItemDetails body: renders every common `ItemData` field present on
 * the item (description, notes, cost, quantity, availability, source,
 * effects, equip/stash/wireless status) plus whichever `ItemDetailsSlot.*`
 * children are passed in for item-type-specific content. Typed details views
 * (e.g. `WeaponItemDetails`) wrap this; the `ItemDetails` dispatcher falls
 * back to this directly for item types without a typed details view.
 */
export const BasicItemDetails: FC<BasicItemDetailsProps> = ({
  item,
  type,
  onEdit,
  onRemove,
  children,
}) => {
  const childArray = Children.toArray(children)

  const statNodes = childArray.filter(isElementType(ItemDetailsSlot.Stat))
  const subitemNodes = childArray.filter(isElementType(ItemDetailsSlot.Subitem))
  const damageTrackNode = childArray.find(isElementType(ItemDetailsSlot.DamageTrack))
  const footerNode = childArray.find(isElementType(ItemDetailsSlot.Footer))
  const customQuickActionNodes = childArray.filter(isElementType(ItemDetailsSlot.QuickAction))

  const hasActions = customQuickActionNodes.length > 0 || Boolean(onEdit) || Boolean(onRemove)
  const hasMeta = item.cost !== undefined || item.quantity !== undefined
    || Boolean(item.availability) || Boolean(item.source)
  const effects = item.effects ?? []

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack sx={{ gap: 0.5 }}>
        {type && <Typography sx={{ color: "text.secondary" }}>{type}</Typography>}
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{item.name}</Typography>

        <ItemDetailsSlot.StatusIcons
          equipped={isEquipped(item)}
          stashed={isStashed(item)}
          wirelessOff={item.wireless?.enabled === false}
        />
      </Stack>

      {hasActions && (
        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
          {customQuickActionNodes}

          {onEdit && (
            <ItemDetailsSlot.QuickAction label="Edit" icon={<RiEditLine size={16} />} onClick={onEdit} />
          )}

          {onRemove && (
            <ItemDetailsSlot.QuickAction
              label="Remove"
              icon={<RiDeleteBinLine size={16} />}
              onClick={onRemove}
            />
          )}
        </Stack>
      )}

      {item.description && (
        <Typography sx={{ color: "text.secondary" }}>{item.description}</Typography>
      )}

      {statNodes.length > 0 && (
        <Stack direction="row" sx={{ gap: 3, flexWrap: "wrap" }}>
          {statNodes}
        </Stack>
      )}

      {damageTrackNode}

      {subitemNodes.length > 0 && (
        <Stack sx={{ gap: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Attached</Typography>
          <Stack sx={{ gap: 1 }}>{subitemNodes}</Stack>
        </Stack>
      )}

      {effects.length > 0 && (
        <Stack sx={{ gap: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Effects</Typography>
          <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
            {effects.map((effect, index) => (
              <Chip
                key={`${effect.type}-${effect.target ?? "none"}-${index}`}
                size="small"
                variant="outlined"
                label={getEffectLabel(effect)}
                sx={{ "height": "auto", "& .MuiChip-label": { whiteSpace: "normal" } }}
              />
            ))}
          </Stack>
        </Stack>
      )}

      {footerNode}

      {hasMeta && (
        <>
          <Divider />
          <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            {item.cost !== undefined && <Typography sx={{ fontSize: "0.85rem" }}>{formatNuyen(item.cost)}</Typography>}
            {item.quantity !== undefined && (
              <Typography sx={{ fontSize: "0.85rem" }}>Qty: {item.quantity}</Typography>
            )}
            {item.availability && <AvailabilityChip availability={item.availability} />}
            {item.source && (
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {formatBookRef(item.source)}
              </Typography>
            )}
          </Stack>
        </>
      )}

      {item.notes && (
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Notes</Typography>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>{item.notes}</Typography>
        </Stack>
      )}
    </Stack>
  )
}
