# Entity Card Composition — Tiered Elements, Renamed Dispatcher

We're extending the card architecture beyond `Item` to the new `Entity` umbrella (Item, Quality,
Spell, Adept Power, eventually Drug — see `CONTEXT.md`). This supersedes the slot mechanism from
ADR-0008 with a tiered compound-component structure, and renames the item-type dispatcher so it
no longer competes for the same identifier as the components namespace.

## Status

accepted — supersedes ADR-0008

## Context

ADR-0008 built `DataCard`/`ItemCard` on a child-scanning slot mechanism (`DataCardSlot`,
`SlotsProvider.find()`): a fixed, growing list of named slots (`Stat`, `Cost`, `Availability`,
`DamageTrack`, `Subitem`, ...) that the generic root inspects its children for. That worked for
Item's ~10 subtypes, which all share `ItemData`'s shape.

Broadening to `Entity` breaks that assumption. Comparing `ItemData`, `QualityData`, `SpellData`,
and `AdeptPowerData` field-by-field, the only fields shared by all four are `id`, `name`,
`description?`, `source?`, `effects?`, and (newly) `rating?` — everything else (`cost`,
`availability`, `drain`, `duration`, `costPerRating`, ...) is category-specific. A single flat
slot list sized to fit every current and future Entity category would either keep growing
unboundedly or accumulate slots most consumers never use. Slots also don't reuse cleanly across
tiers — there's no clean way for `ItemCard` to say "give me `EntityCard`'s `Title` and `Rating`,
plus my own `Availability`" using child-scanning.

Separately, we want the components namespace to read as `ItemCard.Availability` rather than
`ItemCardSlot.Availability` (better discoverability — typing `ItemCard.` should show everything
available). But `src/components/itemCard/itemDataCard.tsx` (the existing `item.itemType`
dispatcher) already carries this warning on itself:

> "This is the only module allowed to depend on every typed card — typed cards must depend on
> `ItemDataCardRoot`/`DataCard` instead of this file, or importing it here would create a cycle."

If the compound components namespace and the dispatcher shared one module under one name, typed
cards (`WeaponCard`, `ArmorCard`, ...) would need to import that combined module for its
components, while the dispatcher inside that same module needs to import every typed card to
dispatch to them — an unavoidable circular import once any typed card needs both roles from the
same file, regardless of which named export is actually used.

## Decision

**Tiered compound components, not slots.** `EntityCard` is the top compound-component tier,
replacing `DataCard`. It provides generic layout regions (`Header`, `Body`, `Footer`) and
Entity-core-bound elements (`Title`, `Rating`, `Source`, `Effects`) plus generic
primitives (`Stat`) and interaction affordances (`Action`). Each category tier (`ItemCard`,
`SpiritCard`, `SpellCard`, `PowerCard`, ...) owns its own incremental elements — e.g. `ItemCard`
adds `Availability`, `Cost`, `Quantity`, `DamageTrack` — reusing `EntityCard`'s elements rather
than duplicating them. A typed card (`WeaponCard`) can create its own one-off element, wrap a
tier's element, or reuse one outright.

**Rename the dispatcher: `ItemDataCard` → `AnyItemCard`.** `AnyItemCard({ item })` is the
component that accepts any `ItemData` and renders the correct typed card, same behavior as
today's dispatcher, new name. This is what breaks the cycle: `AnyItemCard` is the *only* module
allowed to import every typed card. `ItemCard` (root + compound elements) never imports any typed
card, so typed cards can safely import `ItemCard` for its elements without creating one. The
same pattern generalizes upward: an `AnyEntityCard({ entity })` dispatching across
Item/Quality/Spell/Adept Power kinds, each of which then dispatches further (`AnyItemCard`
dispatches across `ItemType`), is the expected shape when that tier is built.

**`*CardElements` stays available as an escape hatch.** Alongside the combined `ItemCard`
(root + attached elements, mirroring today's `DataCard = Object.assign(DataCardComponent,
DataCardSlot)`), an `ItemCardElements` object exposing just the pure, dependency-free element
components remains available for composition contexts that want the building blocks without the
auto-rendering root.

**Elements live in one flat folder, not owned per-tier.** Elements are not strictly
hierarchical, so tier-owned modules don't fit. The concrete case that settled it — `DamageTrack`
is needed by both `ItemCard`
(Vehicle) and `SpiritCard` (Spirit, Sprite), which are *sibling* tiers under `EntityCard`, not
one extending the other. An element needed by two siblings can't be "owned" by either one
without the other importing across a tier it doesn't inherit from. A single flat elements folder
(e.g. `src/components/entityCard/elements/`) sidesteps this — every element lives in one place
regardless of which tier(s) end up using it, and each tier's compound object (`EntityCard`,
`ItemCard`, `SpiritCard`, ...) just assembles whichever subset is relevant to it, via
`Object.assign`, from that shared pool. Still satisfies the no-cycle constraint the same way:
the elements folder never imports any dispatcher.

**Every element in that folder is named with a `CardElement` prefix** — `CardElementTitle`,
`CardElementRating`, `CardElementDamageTrack`, `CardElementAmmo`, etc. This is the source/export
naming inside the flat folder itself (keeps every element unambiguous and sorted together when
browsing the folder, avoids collisions with unrelated components elsewhere in the codebase); it's
separate from the short dot-notation names (`ItemCard.Availability`, `EntityCard.Rating`) each
tier's compound object exposes at call sites — a tier assembles `ItemCard.Availability =
CardElementAvailability` under the hood, so callers never type the prefix themselves.

**`EntityDetailsRoot` (the details-page analog) is out of scope here.** ADR-0009 deliberately
gave `ItemDetails` its own bespoke slots rather than reusing `ItemCard`'s, due to a density
mismatch between card and details rendering. The expectation is that Details will follow an
analogous tiered-elements structure to the one decided here, once it's designed. There's also an
open aspiration to combine Card and Details into a single shared system rather than two parallel
tiered hierarchies — deliberately not decided or designed here; a future ADR should address both
questions together once Details work actually starts.

## Consequences

- Every current typed card (`WeaponDataCard`, `ArmorDataCard`, etc.) needs updating to the new
  tiered elements instead of `DataCardSlot`, and `itemDataCard.tsx` needs renaming to
  `anyItemCard.tsx` (`ItemDataCard` → `AnyItemCard`) — all call sites of the dispatcher change
  along with it.
- `spiritDataCard.tsx`'s use of `DataCard.Content` (today the only consumer of that slot) needs
  an equivalent home in the new `Body` region once `SpiritCard` is built on `EntityCard`.
- New Entity categories (Spell, Adept Power, Drug) get a real path to a typed card without
  inventing new slots on a shared root — they add their own tier's elements instead.

## Considered Options

- **Keep the flat slot/child-scanning mechanism from ADR-0008, extended to more slots** —
  rejected: doesn't scale to Entity categories with mostly-disjoint field sets, and slots don't
  compose/reuse across tiers.
- **Standalone components with no compound namespace at all** — rejected: loses the
  `ItemCard.`-style discoverability wanted when composing a new type-specific card.
- **One identifier for both the dispatcher and the compound namespace** — rejected: creates an
  unavoidable circular import once the dispatcher must import every typed card and typed cards
  must import the compound namespace from the same module.
