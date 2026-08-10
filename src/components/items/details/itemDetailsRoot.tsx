import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import type { FC, PropsWithChildren, ReactNode } from "react"

import { getEffectLabel } from "#/components/system/gameEffects/gameEffectsSummary.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { Icons } from "#/lib/icons.ts"
import type { ItemData } from "#/system/itemData.ts"

import { ItemDetailsSlot, ItemDetailsSlotManager } from "./itemDetailsSlot.tsx"

export interface ItemDetailsRootProps extends PropsWithChildren {
  item: ItemData
  type?: ReactNode
  /** When provided, adds a persistent "Edit" action that opens the item's edit dialog. */
  onEdit?: () => void
  /** When provided, adds a persistent "Remove" action. */
  onRemove?: () => void

  subitemsName?: string

  onAddSubitem?: () => void
  onMoveSubitem?: () => void
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
 * `AnyItemDetails` dispatcher falls back to this directly for item types
 * without a typed details view.
 */
export const ItemDetailsRoot: FC<ItemDetailsRootProps> = ({
  item,
  type,
  onEdit,
  onRemove,
  subitemsName = "Attachments",
  onAddSubitem,
  onMoveSubitem,
  children,
}) => {
  const slots = new ItemDetailsSlotManager(children)

  const effects = item.effects ?? []

  return (
    <Stack sx={{ padding: 2 }}>
      <Stack
        sx={{
          bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
          padding: 2,
          margin: -2,
          marginBottom: 0,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap" }}
        >
          <Stack direction="row" sx={{ alignItems: "center" }}>
            {slots.title ?? <ItemDetailsSlot.Title title={item.name} />}
            {slots.quantity ?? <ItemDetailsSlot.Quantity value={item.quantity} />}
            {slots.cost ?? <ItemDetailsSlot.Cost value={item.cost} />}
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
        >
          <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap" }}>
            {slots.type ?? (type && <ItemDetailsSlot.Type label={type} />)}
            {slots.availability ?? <ItemDetailsSlot.Availability value={item.availability} />}
            {slots.rating}
            {slots.source ?? <ItemDetailsSlot.Source source={item.source} />}
          </Stack>

          <Stack direction="row">
            {item.equipped && (
              <ItemDetailsSlot.Status icon={Icons.item.equipped} label="Equipped" color="success" />
            )}
            {item.stashed && (
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

        {slots.quickActions.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
            {slots.quickActions}
          </Stack>
        )}
      </Stack>

      {item.description && (
        <Stack sx={{ gap: 0.5 }}>
          <Label>Description</Label>
          <Typography sx={{ color: "text.secondary" }}>{item.description}</Typography>
        </Stack>
      )}

      {(slots.stats.length > 0) && (
        <Stack>
          <Label>Stats</Label>

          <Stack direction="row" sx={{ flexWrap: "wrap" }}>
            {slots.stats}
          </Stack>
        </Stack>
      )}

      {slots.damageTracks.length >= 1 && (
        <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "center" }}>
          {slots.damageTracks}
        </Stack>
      )}

      {item.notes && (
        <Stack>
          <Label>Notes</Label>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>{item.notes}</Typography>
        </Stack>
      )}

      <Stack>
        <Label>{subitemsName}</Label>
        <Stack>
          {slots.subitems}

          <ButtonGroup fullWidth>
            {onAddSubitem && (
              <Button
                variant="outlined"
                startIcon={<Icons.item.add />}
                onClick={onAddSubitem}
              >
                Add Item
              </Button>
            )}
            {onMoveSubitem && (
              <Button
                variant="outlined"
                startIcon={<Icons.item.move />}
                onClick={onMoveSubitem}
              >
                Move Item
              </Button>
            )}
          </ButtonGroup>
        </Stack>
      </Stack>

      {effects.length > 0 && (
        <Stack>
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
