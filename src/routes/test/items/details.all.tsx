import Typography from "@mui/material/Typography"
import { RiFlashlightLine, RiStarLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { ItemDetailsRoot } from "#/components/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { Icons } from "#/lib/icons.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export const Route = createFileRoute("/test/items/details/all")({
  component: ItemDetailsTestPage,
})

/** Every common `ItemData` field populated, so `ItemDetailsRoot` renders every one of its own sections. */
const TEST_ITEM: ItemData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID(),
  name: "Test Item — All Slots",
  itemType: ItemType.other,
  description: "A synthetic item with every common field and every ItemDetailsSlot populated, for visual QA.",
  cost: 12_345,
  quantity: 3,
  availability: { rating: 12, restricted: true },
  source: { book: "core", page: 425 },
  notes: "Multi-line notes render as pre-wrap:\nsecond line.\nthird line.",
  equipped: true,
  stashed: true,
  fixed: true,
  wireless: { enabled: false },
  effects: [
    { type: GameEffectType.dicePoolMod, target: "Perception", value: 2 },
    { type: GameEffectType.recoilReduction, value: 1 },
  ],
}

const SUBITEM_A: ItemData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID(),
  name: "Attached Widget",
  itemType: ItemType.other,
  cost: 50,
}

const SUBITEM_B: ItemData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID(),
  name: "Attached Gadget",
  itemType: ItemType.other,
  cost: 200,
  rating: 4,
}

/**
 * Renders one item through `ItemDetailsRoot` with every common field and
 * every `ItemDetailsSlot` populated at once: `Title`/`Type`/`Source`/
 * `Availability`/`Quantity`/`Cost` all overriding their auto-rendered
 * default, a `Rating`, all six `Stat` colors, a `DamageTrack`, two
 * `Subitem`s, a `Footer`, a `Content` block, a custom `Status` chip
 * alongside the built-in equipped/stashed/wireless ones, and a custom
 * `QuickAction` alongside the built-in Edit/Remove — a single page to
 * visually check the whole slot system without hunting through real runner
 * data for an item that happens to use every slot.
 */
function ItemDetailsTestPage() {
  const [damage, setDamage] = useState(3)

  return (
    <ItemDetailsRoot
      item={TEST_ITEM}
      type="Test Type"
      onEdit={() => alert("onEdit")}
      onRemove={() => alert("onRemove")}
    >
      <ItemDetailsSlot.Title title="Overridden Title (via slot)" />
      <ItemDetailsSlot.Type label="Overridden Type" subtype="With Subtype" />
      <ItemDetailsSlot.Source source={{ book: "SR4A", page: 12 }} />
      <ItemDetailsSlot.Availability value={{ rating: 8, restricted: true }} />
      <ItemDetailsSlot.Quantity value={99} />
      <ItemDetailsSlot.Cost value={10000} />
      <ItemDetailsSlot.Rating value={6} />

      <ItemDetailsSlot.Status icon={Icons.item.fixed} label="Fixed" />

      <ItemDetailsSlot.Stat label="Damage" value="8P" type="damage" />
      <ItemDetailsSlot.Stat label="Modifier" value="+2" type="modifier" />
      <ItemDetailsSlot.Stat label="Warning" value="Illegal" type="warning" />
      <ItemDetailsSlot.Stat label="Forbidden" value="Banned" type="forbidden" />
      <ItemDetailsSlot.Stat label="Plain" value="No color" />

      <ItemDetailsSlot.DamageTrack label="Physical" max={10} current={damage} onChange={setDamage} />
      <ItemDetailsSlot.DamageTrack label="Stun" max={10} current={damage} onChange={setDamage} />
      <ItemDetailsSlot.DamageTrack label="Matrix" max={10} current={damage} onChange={setDamage} />

      <ItemDetailsSlot.Subitem item={SUBITEM_A} onOpen={() => alert("open Attached Widget")} />
      <ItemDetailsSlot.Subitem item={SUBITEM_B} />

      <ItemDetailsSlot.QuickAction
        label="Custom Action"
        icon={<RiStarLine size={16} />}
        onClick={() => alert("custom action")}
      />
      <ItemDetailsSlot.QuickAction
        label="Disabled Action"
        icon={<RiStarLine size={16} />}
        onClick={() => {}}
        disabled
      />

      <ItemDetailsSlot.Footer>
        <RiFlashlightLine size={16} />
        <Typography variant="body2">Footer slot content (e.g. a legacy card's carried-over inline action)</Typography>
      </ItemDetailsSlot.Footer>

      <ItemDetailsSlot.Content>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Content slot</Typography>
        <Typography variant="body2">
          Freeform block for content too large or irregular for a Stat block or Footer row.
        </Typography>
      </ItemDetailsSlot.Content>
    </ItemDetailsRoot>
  )
}
