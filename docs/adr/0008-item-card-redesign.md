# Item Card Redesign - Composable Slot Architecture

We're redesigning item cards to be composable, slot-based components that balance information density with clarity. Type-specific cards wrap a generic `ItemCard` base, using repeatable slots for stats, subitems, source, and damage tracking. This approach prioritizes end-to-end clarity (name → key stats → attachments) over showing everything at once.

## Status

accepted

## Context

The current item card implementation scattered type-specific logic across individual card components with inconsistent stat display. As the item system grows (10+ gear types with wildly different stat schemas), a unified but composable approach becomes critical.

## Decision

We're building a generic `ItemCard` component with **repeatable, named slots** (`Stat`, `Subitem`, `Source`, `DamageTrack`, `Footer`) that type-specific cards populate. Each item type (Weapon, Armor, Implant, Device, etc.) wraps the base with its own stat requirements.

**Key architectural choices:**

- **Slot-based architecture:** Each slot has fixed attributes (Stat: label/value/type; Subitem: name/stats array; etc.). Repeatable slots allow flexible layouts without prop explosion.
- **Type-specific wrappers:** WeaponCard, ArmorCard, DeviceCard, etc. compose ItemCard and provide their own stat sections. Leverages existing type-specific components rather than creating a mega-generic card.
- **Balanced information density:** Show name, type badge, 2–4 key stats, and named subitems. Reserve extended details for the detail page (tap anywhere to open).
- **Fixed width cards:** Respond to viewport changes via parent container, not card-internal breakpoints. Simplifies first implementation; dynamic detail expansion is TBD.
- **Built-in tap-to-detail:** Cards handle navigation internally (route to detail page). Context-based navigation (modal/drawer) is TBD for future use cases.

## Consequences

- **More maintainable:** Each type-specific card is self-contained and easy to update. The base handles layout; types handle content.
- **Better UX:** Balanced cards show enough to make decisions without overwhelming. Subitems are named (not just counted), so users see what gear they have without opening the card.
- **Migration overhead:** Requires rebuilding all type-specific cards. We'll start with simple types (License, SIN, Credstick) to validate the pattern, then tackle complex ones.
- **Future context support:** Tapping is currently a route change. Adding modal/drawer opens (e.g., via context) will require passing a navigation function, not changing the card structure.

## Considered Options

**Option A: Single mega-generic card** — Properties would explode; styling would fight different stat systems. Rejected.

**Option B: Separate card per type (status quo)** — Inconsistent UX across types; harder to add new shared features. Rejected.

**Option C: Type-generic layout + render prop** — More flexible but less readable. We prefer slots for clarity.

**Selected: Option (our choice)** — Slots are familiar (compound components), composable, and readable.
