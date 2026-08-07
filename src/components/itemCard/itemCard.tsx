import type { FC, PropsWithChildren } from "react"

import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import type { ItemData } from "#/system/itemData.ts"

import { ItemCardElements } from "./itemCardElements.tsx"

interface ItemCardProps extends PropsWithChildren {
  item: ItemData
}

/**
 * `ItemCard`'s own renderable frame — sits on top of `EntityCard` the way `ItemDataCardRoot` sits
 * on top of `DataCard` today: auto-renders every `ItemData` field `EntityCard` doesn't already
 * cover (availability, cost, quantity, equipped/stashed/fixed/wireless status) by placing them
 * into `EntityCard`'s own `Layout` regions internally. `ItemCard` doesn't re-expose `Layout`
 * itself — a category-tier or typed card that needs another row uses `EntityCard.Layout.*`
 * directly and passes it as `children`, the same as any other `EntityCard` consumer.
 */
const ItemCardRoot: FC<ItemCardProps> = ({ item, children }) => (
  <EntityCard entity={item}>
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
 * way `EntityCard = Object.assign(EntityCardRoot, EntityCardElements, ...)` does. Typed cards
 * still render via `DataCard`/`ItemDataCardRoot` until they migrate (#448–450) — nothing wires
 * `ItemCard` up to a real typed card yet.
 */
export const ItemCard = Object.assign(ItemCardRoot, ItemCardElements)
