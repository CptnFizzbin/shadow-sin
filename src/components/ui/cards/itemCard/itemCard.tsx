import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { Fragment } from "react"

import { useItemActionsDialogContext } from "#/components/entities/items/actions/itemActionsDialogContext.ts"
import { ItemStateMenuActions } from "#/components/entities/items/state/itemStateMenuActions.tsx"
import type { EntityCardProps } from "#/components/ui/cards/entityCard/entityCard.tsx"
import { EntityCard } from "#/components/ui/cards/entityCard/entityCard.tsx"
import { useItemSelectionToggle } from "#/hooks/items/selection/useItemSelection.ts"
import { getItemState } from "#/system/formulas/items/itemStateRules.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { isFocusData } from "#/system/model/items/magicalData.ts"

import { ItemCardElements } from "./itemCardElements.tsx"
import { ItemCardSlotManager } from "./itemCardSlotManager.ts"

export interface ItemCardProps extends Omit<EntityCardProps, "entity"> {
  item: ItemData
  /**
   * Overrides `item.cost` for display when a modifier changes what the item actually costs (e.g.
   * an Implant grade's nuyen multiplier) — threaded straight through to `ItemCardElements.Cost`'s
   * `effectiveValue`. Exists as a root prop (rather than a `children` override) because Cost is
   * auto-rendered by this root, not composable by a typed card the way stat rows are.
   */
  costEffectiveValue?: number
}

/**
 * `ItemCard`'s own renderable frame — sits on top of `EntityCard`, auto-rendering every
 * `ItemData` field `EntityCard` doesn't already cover (availability, cost, quantity,
 * equipped/implanted/active/stashed/fixed/wireless status) by placing them into `EntityCard`'s own `Layout`
 * regions internally. A category-tier or typed card that needs another row uses
 * `ItemCard.Layout.*` (re-exported from `EntityCard`, see below) and passes it as `children`.
 * Inside an `ItemActionsDialogProvider`, the menu button opens the Item actions dialog (with
 * `onEdit`, when given, as its Edit action); elsewhere `onEdit`/`onRemove` fill `EntityCard`'s own
 * menu, alongside the item's state actions (Equip, Stash, ...). `onOpen`/`leftAction` pass
 * straight through to `EntityCard`. While the gear list is in selection mode, the card is a
 * checkbox for the Item instead (see `useItemSelectionToggle`).
 */
const ItemCardRoot: FC<ItemCardProps> = ({ item, costEffectiveValue, onEdit, onRemove, children, ...props }) => {
  const slots = new ItemCardSlotManager(children)
  const itemActionsDialog = useItemActionsDialogContext()
  const selectionToggle = useItemSelectionToggle(item.id)
  const itemState = getItemState(item)
  const hasAvailability = !!item.availability && item.availability.rating !== 0

  const footerParts = [
    hasAvailability && <ItemCardElements.Availability value={item.availability} />,
    ...slots.footerStats,
    item.cost !== undefined && <ItemCardElements.Cost value={item.cost} effectiveValue={costEffectiveValue} />,
  ].filter(Boolean)

  const menuProps = itemActionsDialog
    ? { onOpenActions: () => itemActionsDialog.open({ item, onEdit }) }
    : {
        onEdit,
        onRemove,
        menuActions: (closeMenu: () => void) => <ItemStateMenuActions item={item} onDone={closeMenu} />,
      }

  return (
    <EntityCard
      entity={item}
      allowCompact={false}
      {...props}
      {...menuProps}
      selection={selectionToggle && { selected: selectionToggle.isSelected, onToggle: selectionToggle.toggle }}
    >
      <EntityCard.Layout.TitleRight>
        <ItemCardElements.Quantity value={item.quantity} />
      </EntityCard.Layout.TitleRight>

      {slots.subType && (
        <EntityCard.Layout.HeaderRow>
          {slots.subType}
        </EntityCard.Layout.HeaderRow>
      )}

      {slots.stats.length >= 1 && (
        <EntityCard.Layout.BodyRow sx={{ flexWrap: "wrap" }}>
          {slots.stats}
        </EntityCard.Layout.BodyRow>
      )}

      <EntityCard.Layout.TopRight>
        {itemState === ItemState.equipped && <ItemCardElements.StatusIcon status="equipped" />}
        {itemState === ItemState.implanted && <ItemCardElements.StatusIcon status="implanted" />}
        {itemState === ItemState.active && <ItemCardElements.StatusIcon status="active" />}
        {itemState === ItemState.stashed && <ItemCardElements.StatusIcon status="stashed" />}
        {isFocusData(item) && item.bonded && <ItemCardElements.StatusIcon status="bonded" />}
        {item.fixed && <ItemCardElements.StatusIcon status="fixed" />}
        {item.wireless && (
          item.wireless.removed
            ? <ItemCardElements.StatusIcon status="wireless-removed" />
            : <ItemCardElements.StatusIcon status={item.wireless.enabled ? "wireless-enabled" : "wireless-disabled"} />
        )}
      </EntityCard.Layout.TopRight>

      <EntityCard.Layout.FooterRight sx={{ justifyContent: "center", alignItems: "center" }}>
        <Stack direction="row" sx={{ flexGrow: 1, justifyContent: "flex-end", alignItems: "baseline" }}>
          {footerParts.map((footerPart, index) => (
            <Fragment key={index}>
              {index > 0 && <span>•</span>}
              {footerPart}
            </Fragment>
          ))}
        </Stack>
      </EntityCard.Layout.FooterRight>

      {slots.unmapped}
    </EntityCard>
  )
}

ItemCardRoot.displayName = "ItemCard"

/**
 * Category tier from ADR-0010, sitting between `EntityCard` (universal) and a concrete typed
 * card (`WeaponCard`, `ArmorCard`, ...). `ItemCardRoot` is the renderable frame; `ItemCardElements`
 * are attached onto it via `Object.assign` — `ItemCard.Title`, `ItemCard.Cost`, etc. — the same
 * way `EntityCard = Object.assign(EntityCardRoot, EntityCardElements, { Layout: ... })` does.
 * `Layout` is re-exported from `EntityCard` unchanged (not a distinct `ItemCard`-owned copy) so
 * typed cards reach it as `ItemCard.Layout.*` without a separate `EntityCard` import.
 */
export const ItemCard = Object.assign(ItemCardRoot, ItemCardElements, { Layout: EntityCard.Layout })
