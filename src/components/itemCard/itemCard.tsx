import type { FC, PropsWithChildren } from "react"

import type { EntityCardLeftAction } from "#/components/entityCard/entityCard.tsx"
import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import type { ItemData } from "#/system/itemData.ts"

import { ItemCardElements } from "./itemCardElements.tsx"

interface ItemCardProps extends PropsWithChildren {
  item: ItemData
  /** When provided, the whole card becomes tappable/keyboard-activatable and invokes this (e.g. navigate to the item's details page). */
  onOpen?: () => void
  /** When provided, adds an "Edit" action to the actions menu that opens the item's edit dialog. */
  onEdit?: () => void
  /** When provided, adds a "Remove" action to the actions menu. */
  onRemove?: () => void
  /** Outline-style button pinned to the left edge of the card, spanning its full height. */
  leftAction?: EntityCardLeftAction
}

/**
 * `ItemCard`'s own renderable frame — sits on top of `EntityCard` the way `ItemDataCardRoot` sits
 * on top of `DataCard` today: auto-renders every `ItemData` field `EntityCard` doesn't already
 * cover (availability, cost, quantity, equipped/stashed/fixed/wireless status) by placing them
 * into `EntityCard`'s own `Layout` regions internally. A category-tier or typed card that needs
 * another row uses `ItemCard.Layout.*` (re-exported from `EntityCard`, see below) and passes it
 * as `children`. `onOpen`/`onEdit`/`onRemove`/`leftAction` pass straight through to `EntityCard`
 * for its tap-to-open behavior, menu-button actions, and left-edge action button.
 */
const ItemCardRoot: FC<ItemCardProps> = ({ item, onOpen, onEdit, onRemove, leftAction, children }) => (
  <EntityCard entity={item} onOpen={onOpen} onEdit={onEdit} onRemove={onRemove} leftAction={leftAction}>
    <EntityCard.Layout.HeaderRow>
      {item.equipped && <ItemCardElements.StatusIcon status="equipped" />}
      {item.stashed && <ItemCardElements.StatusIcon status="stashed" />}
      {item.fixed && <ItemCardElements.StatusIcon status="fixed" />}
      {item.wireless && (
        item.wireless.removed
          ? <ItemCardElements.StatusIcon status="wireless-removed" />
          : <ItemCardElements.StatusIcon status={item.wireless.enabled ? "wireless-enabled" : "wireless-disabled"} />
      )}
    </EntityCard.Layout.HeaderRow>

    <EntityCard.Layout.BodyRow>
      <ItemCardElements.Availability value={item.availability} />
      <ItemCardElements.Quantity value={item.quantity} />
    </EntityCard.Layout.BodyRow>

    <EntityCard.Layout.FooterRow>
      <ItemCardElements.Cost value={item.cost} />
    </EntityCard.Layout.FooterRow>

    {children}
  </EntityCard>
)

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
