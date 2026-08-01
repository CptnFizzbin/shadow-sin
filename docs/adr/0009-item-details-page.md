# Item Details Page - Full-Screen Route with Bespoke Compound Slots

We're adding a read-only Item Details page, reached by tapping an `ItemCard`, that shows the
extended information ADR-0008 deliberately left off the card. It reuses the compound-slot shape
of `ItemCard` but not its components, renders as a distinct full-screen route rather than another
runner tab, and splits the card's tap and edit actions apart to make room for it.

## Status

accepted

## Context

ADR-0008 balanced `ItemCard` for density and explicitly deferred "extended details" and the
tap-to-open mechanism as TBD. We're now building that destination. Three things were already true
of the surrounding system and shaped the options:

- Items are stored flat (`RunnerData.gear: Record<id, Item>`), not partitioned by section route.
- Every dialog in the app (per ADR-0004) is declared locally via `use*FormDialog()` hooks and
  rendered inline at the caller's position — there's no global dialog registry to hook into.
- The `$runnerId` layout (`src/routes/$runnerId.tsx`) wraps every nested route in `RunnerNav` (a
  tab bar) and a swipe surface that pages between a fixed, explicitly-registered set of top-level
  sections (`runnerSections.ts`). Neither mechanism has a notion of a drill-down page.

## Decision

**One shared route, dispatch-based.** `/$runnerId/item/$itemId` looks up the item and dispatches
on `item.itemType`, mirroring the existing `ItemCard` dispatcher, instead of a detail route
per section. This matches the flat storage model and avoids duplicating dispatch logic.

**Full-screen, not a tab, via a pathless-layout split.** A drill-down page isn't a peer section,
and `useRunnerNav`'s section lookup would silently treat it as "about" (wrong tab highlighted,
wrong swipe target) if left in the tab shell. `src/routes/$runnerId.tsx` loads the Runner and sets
up its store/dice-tray context only — it has no chrome of its own. Two pathless layouts sit under
it as siblings, neither adding a URL segment: `$runnerId/_viewer.tsx` (the `RunnerNav`/swipe-surface
chrome, wrapping the 17 existing section routes) and `$runnerId/_details.tsx` (bare — each page
under it, like the item details route, owns its own back navigation). `/$runnerId/gear` and
`/$runnerId/item/$itemId` are both direct children of `$runnerId`, differing only in which sibling
layout renders them. This split was originally going to be deferred to its own follow-up branch
(it touches all 17 section route files) but landed concurrently in #426 as a rough placeholder;
this PR reconciles the two into the shape described here rather than carrying a temporary
`RunnerContent` chrome-opt-out hack.

**Bespoke slots, not reused ones.** `ItemDetailsSlot` (`Stat`, `Subitem`, `DamageTrack`, `Footer`,
`StatusIcons`, `QuickAction`) is a new, parallel module to `ItemCardSlot` — not built on top of it,
even where a card slot looks generic enough to share (e.g. `Stat`). Card slots are condensed for
space; details slots render the same concepts at higher fidelity (full labels, nested stat rows,
richer subitems). Forcing them to share components now would mean fighting the card's
space-constrained styling the moment details needed to diverge.

**`BasicItemDetails` auto-renders common fields.** Same split as `BasicItemCard`/`ItemCard`:
`BasicItemDetails` renders every common `ItemData` field present on the item — `description`,
`notes`, `cost`, `quantity`, `availability`, `source`, `effects`, equip/stash/wireless status —
without the type-specific card needing to ask for them. Only type-specific content (stats,
subitems, damage track, footer, quick actions) goes through slots. This is exactly the "extended
detail, reserved off the card" content ADR-0008 pointed at, and it's a bounded, known shape (every
field already exists on `ItemData`), not open-ended design work.

**Big-bang rollout.** Unlike `ItemCard` (which shipped its slot foundation, then converted the nine
item types in a follow-up PR), this ships the foundation and all nine typed `*ItemDetails`
components (Weapon, Armor, License, SIN, Credstick, Device, Program, Implant, Vehicle) together.

**Tap navigates, edit is a separate action.** `onOpen` now means "navigate to the details page" at
every card call site, replacing its previous meaning ("open the edit dialog"). A new `onEdit` prop
carries the old behavior — it opens the item's existing `use*FormDialog()` hook — and is exposed as
a quick action in the card's long-press/right-click menu, and as a button on the details page
itself. This is a breaking change to `ItemCardProps`/`BasicItemCardProps`, touching all nine typed
cards and every list call site, because the old menu derived its "Edit" entry from `onOpen`
directly — that coupling has to break for tap and edit to point at different destinations.

## Consequences

- Every `onOpen` call site across the app changes meaning; call sites that only ever meant "edit"
  (never gave the user a details view before) now need both an `onOpen` (navigate) and an `onEdit`
  (dialog) wired.
- Every existing section route file's `createFileRoute` id shifted (e.g.
  `/_viewer/$runnerId/gear` → `/$runnerId/_viewer/gear`) as part of reconciling with #426; the
  actual URL paths users see (`/$runnerId/gear`, `/$runnerId/item/$itemId`) are unchanged, since
  pathless layouts never contribute a URL segment.
- A compound `EditItemDialog`, built with a similar slot system to `ItemDetails`, is planned as
  future work to replace the current per-type `use*FormDialog()` hooks — out of scope here.

## Considered Options

- **Modal/drawer instead of a route** — rejected; explicitly decided in favor of full-screen routes
  so the details page is linkable/back-button-navigable like every other runner section.
- **Reuse `ItemCardSlot` components under new names** — rejected; the density mismatch between
  card and details rendering would have meant immediately overriding most of what was reused.
- **Keep the temporary `RunnerContent` chrome-opt-out hack instead of reconciling with #426** —
  rejected once #426's pathless-layout split landed on the base branch; carrying a redundant,
  more fragile mechanism alongside the real fix would have been worse than integrating it.
- **Staged rollout (foundation first, typed wrappers later), matching ADR-0008's migration** —
  rejected in favor of a big-bang implementation for this feature.
