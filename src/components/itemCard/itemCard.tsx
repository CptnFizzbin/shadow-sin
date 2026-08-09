import Stack from "@mui/material/Stack"
import type { FC } from "react"

import type { EntityCardProps } from "#/components/entityCard/entityCard.tsx"
import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import type { ItemData } from "#/system/itemData.ts"

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
 * `ItemCard`'s own renderable frame — sits on top of `EntityCard` the way `ItemDataCardRoot` sits
 * on top of `DataCard` today: auto-renders every `ItemData` field `EntityCard` doesn't already
 * cover (availability, cost, quantity, equipped/stashed/fixed/wireless status) by placing them
 * into `EntityCard`'s own `Layout` regions internally. A category-tier or typed card that needs
 * another row uses `ItemCard.Layout.*` (re-exported from `EntityCard`, see below) and passes it
 * as `children`. `onOpen`/`onEdit`/`onRemove`/`leftAction` pass straight through to `EntityCard`
 * for its tap-to-open behavior, menu-button actions, and left-edge action button.
 */
const ItemCardRoot: FC<ItemCardProps> = ({ item, costEffectiveValue, children, ...props }) => {
  const slots = new ItemCardSlotManager(children)

  return (
    <EntityCard entity={item} {...props}>
      <EntityCard.Layout.TitleRight>
        <ItemCardElements.Quantity value={item.quantity} />
      </EntityCard.Layout.TitleRight>

      {slots.subType && (
        <EntityCard.Layout.HeaderRow>
          {slots.subType}
        </EntityCard.Layout.HeaderRow>
      )}

      {slots.stats.length >= 1 && (
        <EntityCard.Layout.BodyRow sx={{ gap: 1, flexWrap: "wrap" }}>
          {slots.stats}
        </EntityCard.Layout.BodyRow>
      )}

      <EntityCard.Layout.TopRight sx={{ gap: 1 }}>
        {item.equipped && <ItemCardElements.StatusIcon status="equipped" />}
        {item.stashed && <ItemCardElements.StatusIcon status="stashed" />}
        {item.fixed && <ItemCardElements.StatusIcon status="fixed" />}
        {item.wireless && (
          item.wireless.removed
            ? <ItemCardElements.StatusIcon status="wireless-removed" />
            : <ItemCardElements.StatusIcon status={item.wireless.enabled ? "wireless-enabled" : "wireless-disabled"} />
        )}
      </EntityCard.Layout.TopRight>

      <EntityCard.Layout.FooterRight sx={{ gap: 1, justifyContent: "center", alignItems: "center" }}>
        <Stack direction="row" sx={{ gap: 1, flexGrow: 1, justifyContent: "flex-end", alignItems: "baseline" }}>
          <ItemCardElements.Availability value={item.availability} />
          <ItemCardElements.Cost value={item.cost} effectiveValue={costEffectiveValue} />
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
