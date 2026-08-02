import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { getEffectLabel } from "#/components/system/gameEffects/gameEffectsSummary.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { Icons } from "#/lib/icons.ts"
import type { ItemData } from "#/system/itemData.ts"
import { isEquipped, isStashed } from "#/system/items/itemUtils.ts"

import { ItemDetailsSlot, ItemDetailsSlotsProvider } from "./itemDetailsSlot.tsx"

export interface ItemDetailsRootProps {
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
 * the item (title, type, description, notes, cost, quantity, availability,
 * source, effects, equip/stash/wireless status) plus whichever
 * `ItemDetailsSlot.*` children are passed in for item-type-specific content.
 * `Title`/`Type`/`Source`/`Availability`/`Quantity`/`Cost` can be passed as
 * children to override the field auto-rendered from `item`/`type`; `Rating`
 * and `Content` are purely additive, with no default rendering of their own.
 * Typed details views (e.g. `WeaponItemDetails`) wrap this; the
 * `ItemDetails` dispatcher falls back to this directly for item types
 * without a typed details view.
 */
export const ItemDetailsRoot: FC<ItemDetailsRootProps> = ({
  item,
  type,
  onEdit,
  onRemove,
  children,
}) => {
  const slots = new ItemDetailsSlotsProvider(children)

  const effects = item.effects ?? []

  return (
    <Stack sx={{ padding: 2 }}>
      <Stack
        sx={{
          bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
          padding: 2,
          margin: -2,
        }}
      >
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            {slots.title ?? <ItemDetailsSlot.Title title={item.name} />}
            {slots.quantity}
            {slots.cost}
          </Stack>

          <Stack direction="row" sx={{ alignItems: "center" }}>
            <ButtonGroup>
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
            </ButtonGroup>
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            {slots.type ?? (type && <ItemDetailsSlot.Type label={type} />)}
            {slots.availability}
            {slots.rating}
            {slots.source}
          </Stack>

          <Stack direction="row">
            {isEquipped(item) && (
              <ItemDetailsSlot.Status icon={Icons.item.equipped} label="Equipped" color="success" />
            )}
            {isStashed(item) && (
              <ItemDetailsSlot.Status icon={Icons.item.stashed} label="Stashed" />
            )}
            {item.wireless && (() => {
              const { removed, enabled } = item.wireless

              if (removed) {
                return (
                  <ItemDetailsSlot.Status
                    icon={Icons.item.wireless.removed}
                    label="Wireless Removed"
                    color="error"
                  />
                )
              } else if (enabled) {
                return <ItemDetailsSlot.Status icon={Icons.item.wireless.enabled} label="Wireless On" />
              } else {
                return <ItemDetailsSlot.Status icon={Icons.item.wireless.disabled} label="Wireless Off" />
              }
            })()}
            {slots.statuses}
          </Stack>
        </Stack>
      </Stack>

      {slots.quickActions.length > 0 && (
        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
          {slots.quickActions}
        </Stack>
      )}

      {item.description && (
        <Typography sx={{ color: "text.secondary" }}>{item.description}</Typography>
      )}

      {(slots.stats.length > 0) && (
        <Stack direction="row" sx={{ flexWrap: "wrap" }}>
          {slots.stats}
        </Stack>
      )}

      {slots.damageTracks}

      {item.notes && (
        <Stack sx={{ gap: 0.5 }}>
          <Label>Notes</Label>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>{item.notes}</Typography>
        </Stack>
      )}

      <Stack sx={{ gap: 1 }}>
        <Label>Attachments</Label>
        <Stack sx={{ gap: 1 }}>{slots.subitems}</Stack>
        <ButtonGroup fullWidth>
          <Button variant="outlined" startIcon={<Icons.item.add />}>Add Item</Button>
          <Button variant="outlined" startIcon={<Icons.item.move />}>Move Item</Button>
        </ButtonGroup>
      </Stack>

      {effects.length > 0 && (
        <Stack sx={{ gap: 1 }}>
          <Label>Effects</Label>

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

      {slots.content}

      {slots.footer}
    </Stack>
  )
}
