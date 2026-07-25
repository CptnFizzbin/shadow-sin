# Item Stashing

> **Status:** Ready to Implement
>
> **GitHub Issues / PRs:**
> - [#388 — `ItemData._state` object (equipped, stashed) + itemUtils everywhere it matters](https://github.com/CptnFizzbin/shadow-sin/issues/388)
> - [#390 — Unified per-item action menu; Equip becomes universal](https://github.com/CptnFizzbin/shadow-sin/issues/390)
> - [#392 — Multi-select bulk actions](https://github.com/CptnFizzbin/shadow-sin/issues/392)
> - [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md) depends on
>   #388 for `ItemData._state.stashed`
> - See [`docs/adr/0006-item-state-scope.md`](../adr/0006-item-state-scope.md) for why `_state`
>   holds only `equipped`/`stashed` (not `fixed`/`wireless`), and why there's no combined
>   "actively equipped" helper

A general, persisted way to mark a piece of carried gear as unavailable for a given run — "left at
the safehouse" — without deleting it or leaving the Builder. Discovered as a dependency while
designing [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md): that
feature originally prototyped "stashing" as local, single-dialog state, but the mechanic clearly
belongs on the item itself, since a stashed item should read as unavailable everywhere a Runner's
gear is shown, not just inside one dialog.

Grilling this feature surfaced that a clean implementation touches more than just the new field —
it also unifies gear cards' scattered direct-icon actions into one menu, and (while already in
that code) closes a pre-existing gap where item removal has no confirmation step.

## Resolved Questions

- **Persistence:** a new field, `ItemData._state.stashed?: boolean`, alongside the existing
  `equipped` value which moves into the same `_state` object (`ItemData._state.equipped?:
  boolean`). `_state` is internal storage (leading underscore, same convention as
  `RunnerData._meta_`) — read through `isEquipped(item)` / `isStashed(item)` in
  `src/system/items/itemUtils.ts`, not accessed directly outside the edit form. `fixed` and
  `wireless` stay top-level fields, unaffected by this change — see
  [`docs/adr/0006-item-state-scope.md`](../adr/0006-item-state-scope.md). Not local dialog state —
  it lasts until explicitly toggled back. Available on every `ItemData`, unconditionally (unlike
  `equipped`'s history of being gated per `ItemType`) — any gear, including a SIN's covered
  Licences, can be left behind.
- **`stashed` and `equipped` are independent, coexisting flags, not mutually exclusive.**
  `stashed` *overrides* `equipped` — it does not clear it. A weapon can be `_state: { equipped:
  true, stashed: true }` at the same time; while stashed it behaves as not-actively-equipped, but
  the underlying `equipped` value is preserved, so un-stashing "just works" with no separate
  restore step needed.
- **`isEquipped(item)` / `isStashed(item)` utilities** — new plain functions in
  `src/system/items/itemUtils.ts` that replace every existing raw `.equipped` read that drives
  real mechanical behavior. There is deliberately no combined "actively equipped" helper — call
  sites that need to know whether Equipped's effect is actually active check `isEquipped(item) &&
  !isStashed(item)` directly (see Constraints for the full list). Prevents a missed call site from
  silently letting a stashed item keep contributing encumbrance, GameEffects, wound modifiers, etc.
- **Gear-list presentation:** a stashed item is greyed out and sorted to the bottom of its gear
  listing, rather than hidden. The existing "Equipped" display chips (`genericItemCard.tsx`,
  `gearViewItem.tsx`, `weaponItemCard.tsx`, `armorItemCard.tsx`) switch from raw `item.equipped` to
  `isEquipped(item) && !isStashed(item)` too, so a stashed-but-equipped item doesn't misleadingly
  show as Equipped.
- **Parent/child cascade:** stashing a parent item (e.g. a weapon with attachments) cascades to
  all of its children — you can't stash the gun but keep the scope active. A child cannot be
  independently un-stashed while its parent is stashed, since the whole assembly is already
  excluded. A child *can* be stashed independently of an active (non-stashed) parent — e.g.
  stashing just the scope while keeping the gun in play.
- **No Builder/Viewer split.** `GenericItemCard` is already shared, unmodified, between Builder
  (`itemsList.tsx`) and Viewer contexts, and already surfaces `equipped` state in both today. Stash
  and the new menu/bulk actions below work identically everywhere the shared cards render — no new
  gating logic.
- **No Nuyen/BP interaction.** Builder's gear-cost totaling (`gearUtils.ts`) never reads `equipped`
  today, so stashing an item doesn't change how it counts toward BP or Nuyen budgets either —
  consistent with existing precedent, not a new rule.
- [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md) consumes this
  flag directly: its per-run checklist reflects (and can toggle) `stashed` rather than keeping its
  own local exclusion state.

### Per-item action menu

- `GenericItemCard` and `GearViewItem`'s current direct icon-button actions (Edit, Remove, Buy
  License) are replaced by a single overflow menu (plain MUI `Menu`/`MenuItem`, same pattern
  already used by `runnerRosterList.tsx`'s roster kebab menu — no bespoke menu component exists
  yet). The menu holds **all** per-item actions: Edit, Equip/Unequip, Stash/Unstash, Remove, Buy
  License.
- **Equip becomes available on every item type**, not just weapons/armor. The existing
  "Equippable" checkbox (`itemOptionsDialog.tsx`, driven by `useItemOptions`'s
  `ItemOptionsDefaults`) loses its per-`ItemType` forcing — weapons/armor's `equipable: { forced:
  true }` and implants' `equipable: { forced: true, enabled: false }` are removed, so every item
  type gets the same free-choice opt-in a Player sets per item instance. The quick-menu's
  Equip/Unequip entry is shown using the same "has this item been configured with an equip value"
  heuristic `useItemOptions` already applies in edit mode (`initialValues.equipped !== undefined`).
- **Remove gains a confirmation step**, for both the per-item menu action and bulk Remove (below).
  This changes existing behavior — single-item Remove currently has none — but the app has no undo
  feature yet, so an accidental single removal is exactly as unrecoverable as an accidental bulk
  one. Uses the existing `useConfirmDialog()` pattern (already used by `itemOptionsDialog.tsx`'s
  "make item removable?" prompt).

### Bulk actions

Both Builder (`gearSection.tsx`) and Viewer (`gearViewSection.tsx`) already render gear as a stack
of independent `Accordion` sections, one per gear type — Builder keeps only one section expanded
at a time (`activeSection` state), Viewer allows several open at once. Selection deliberately does
not follow that structure:

- **Selection is global**, spanning every gear-type section at once — including sections currently
  collapsed. A Player can select some Weapons, close that accordion, open Armor, and add to the
  same selection.
- **Entry:** an explicit "Select" toggle button (near the search bar in Viewer's `gear.tsx`, near
  the BP/Nuyen summary in Builder's `gearSection.tsx`). Off by default — checkboxes only appear on
  cards once selection mode is active.
- **Card interaction while selecting:** the whole card becomes the tap target for select/deselect
  (checkbox shown, but not the only clickable area) — `GearViewItem`'s current
  `onClick={onEdit}` on the card body is suppressed while selection mode is active. The per-item
  overflow menu (see above) is hidden entirely during selection mode, rather than staying
  clickable alongside it — one interaction model on the card at a time.
- **Sub-items:** selecting a parent auto-selects its children (individually toggleable off
  afterward). This is a selection-UI convenience, distinct from Stash's own cascade rule (which
  forces children stashed regardless of what was selected when the action actually runs).
- **No select-all.** Given selection already spans sections the Player may not currently be
  looking at, a blanket select-all risks silently sweeping in forgotten items — selection stays
  manual, per item.
- **Bar placement:** a sticky bottom bar that *replaces* the existing sticky-bottom
  dice-tray/quick-access `ButtonGroup` (`src/routes/$runnerId.tsx:76-84`) in the same slot while
  selection mode is active, styled with a distinct color so the mode change is unmistakable. Shows
  the bulk action bar supporting Stash/Unstash, Equip/Unequip, and Remove (same confirmation as
  single Remove).
- **Bulk Equip on a mixed selection:** applies only to selected items that have Equip enabled for
  that instance, silently skipping the rest — the same "just works on whatever applies" behavior
  Stash and Remove already have, since both apply to every item type unconditionally.
- **After a bulk action completes, selection mode auto-exits** back to normal browsing (rather
  than staying active for another round).

## Constraints

- `.equipped` is currently read directly (not through a shared helper) at these sites, all of
  which must switch to `isEquipped(item) && !isStashed(item)`:
  - `src/components/system/encumbrance/useEncumbrance.ts`
  - `src/components/system/gameEffects/useGameEffects.ts`
  - `src/components/system/damage/damageUtils.ts` (two call sites)
  - `src/components/items/types/armor/equippedArmorSection.tsx`
  - `src/components/items/types/weapons/equippedWeaponsSection.tsx`
  - `src/components/items/types/weapons/dialogs/weaponAttackDialog.tsx`
  - Display chips: `src/components/items/genericItemCard.tsx`,
    `src/components/runner/gearPage/gearViewItem.tsx`,
    `src/components/items/types/weapons/weaponItemCard.tsx`,
    `src/components/items/types/armor/armorItemCard.tsx`
  - `useItemOptions.ts`'s own `.equipped` checks are about the edit-form's field-presence logic,
    not "is this item mechanically active" — those stay as raw `_state.equipped` reads, unrelated
    to `itemUtils`.
- **A new migration is required**, even though `stashed` is purely additive and optional. This
  repo's convention adds a migration for every schema change regardless of triviality — see
  `20260517_addFeatureFlags.ts` and `20260521_addKarmaLog.ts` for recent precedent of migrations
  for similarly additive fields. Never edit an existing migration file (see `AGENTS.md`). This
  migration also moves the existing top-level `equipped` value into `_state.equipped` for every
  item in `gear`, deleting the stale top-level key; `20260417_setDefaultEquippedWeapons.ts` must be
  updated to write `_state.equipped` and confirmed to run after this migration.
- Must not conflict with or duplicate `equipped` at the data level — see "independent, coexisting
  flags" above; this replaces an earlier, incorrect assumption that stashing would force
  `equipped` to `false`.

## Domain Notes

**Stash** and **Equipped** are now defined in `CONTEXT.md` (added alongside this doc). Summary:
`Equipped` (`ItemData._state.equipped`) says a *present* item is actively worn/wielded; `Stash`
(`ItemData._state.stashed`) says an item isn't with the Runner at all right now, and overrides
Equipped's effect without clearing its stored value. An item can be present, unequipped, and not
stashed all at once (e.g. a spare pistol in a holster) — the two flags are independent axes, not a
spectrum.

## Rough Interface Sketches

_High-level shapes only — no implementation code._

```ts
interface ItemData {
  // ...existing fields (fixed, wireless stay top-level, unchanged)
  _state?: {
    equipped?: boolean
    stashed?: boolean
  }
}

// src/system/items/itemUtils.ts
// No combined "actively equipped" helper — call sites compose these directly:
// isEquipped(item) && !isStashed(item)
function isEquipped(item: ItemData): boolean {
  return item._state?.equipped === true
}

function isStashed(item: ItemData): boolean {
  return item._state?.stashed === true
}
```

## Out of Scope

- Any License-Check-specific behavior — that lives entirely in
  [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md); this feature
  only defines and persists the flag itself.
- An undo feature for Remove (or anything else) — Remove's new confirmation step is a stopgap
  given no undo exists, not a substitute for one.
- Extending the bulk action bar beyond Stash/Equip/Remove (e.g. bulk edit, bulk Buy License).

## Related Features

- [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md) — the feature
  that surfaced this as a dependency; License Check's per-run checklist reads and toggles
  `stashed` rather than keeping its own local state
