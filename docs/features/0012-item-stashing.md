# Item Stashing

> **Status:** Ready to Implement
>
> **GitHub Issues / PRs:**
> - [#388 — `ItemData._state` object (equipped, stashed) + itemUtils everywhere it matters](https://github.com/CptnFizzbin/shadow-sin/issues/388)
> - [#390 — Unified per-item action menu; Equip becomes universal](https://github.com/CptnFizzbin/shadow-sin/issues/390)
> - [#392 — Multi-select bulk actions](https://github.com/CptnFizzbin/shadow-sin/issues/392)
> - [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md) depends on
>   #388 for `ItemData.stashed`
> - See [`docs/adr/0006-item-state-scope.md`](../adr/0006-item-state-scope.md) — as implemented,
>   `equipped`/`stashed` are plain top-level fields; `_state.equipOnUnstash` is narrower internal
>   bookkeeping the gear reducer uses to force `equipped` off on Stash and restore it on Unstash,
>   not a general mirror of the two public fields (the ADR's "History" section covers the pivot)

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

- **Persistence:** `ItemData.stashed?: boolean`, a plain top-level field alongside the existing
  `equipped` — both read/write directly, the same as any other `ItemData` field, not nested under
  `_state`. `fixed` and `wireless` are unaffected by this change — see
  [`docs/adr/0006-item-state-scope.md`](../adr/0006-item-state-scope.md). Not local dialog state —
  it lasts until explicitly toggled back. Available on every `ItemData`, unconditionally (unlike
  `equipped`'s history of being gated per `ItemType`) — any gear, including a SIN's covered
  Licences, can be left behind (gated per type via the `canBeStashed` item option where it doesn't
  make sense).
- **`stashed` and `equipped` interact through the gear reducer, not at every read site.** The
  moment `stashed` becomes `true` (however it's written — the edit form, or the dedicated
  `Actions.item.setStashed`), the reducer forces `equipped` to `false` and records what it was in
  `ItemData._state.equipOnUnstash` (internal — see the ADR). Un-stashing restores it automatically.
  `item.equipped` is therefore always trustworthy on its own; readers never need `&&
  !item.stashed`.
- **`isEquipped(item)` / `isStashed(item)` in `src/system/items/itemUtils.ts` are deprecated.**
  Read `item.equipped` / `item.stashed` directly — they're plain fields the reducer keeps
  consistent (see above), so the helpers add nothing over a direct field read anymore.
- **Gear-list presentation:** a stashed item is greyed out and sorted to the bottom of its gear
  listing, rather than hidden. Existing "Equipped" display chips read `item.equipped` directly —
  no compound check needed, since the reducer already guarantees a stashed item's `equipped` is
  `false`.
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

- `.equipped` was read directly (not through a shared helper) at several encumbrance/game-effects/
  damage/display call sites. As implemented, they stay that way — reading `item.equipped` directly
  is correct and sufficient, since the gear reducer already guarantees it's `false` while
  `item.stashed` is `true` (see Resolved Questions). `isEquipped`/`isStashed` in `itemUtils.ts`
  exist only as deprecated wrappers for any caller not yet updated.
  - `useItemOptions.ts`'s own `.equipped` checks are about the edit-form's field-presence logic,
    not "is this item mechanically active" — unrelated to the above, unaffected either way.
- **No new migration was needed.** `equipped` and `stashed` were already both present as top-level
  `ItemData` fields before this ticket (`stashed` simply unused until now) — see
  `docs/adr/0006-item-state-scope.md`'s History section. `_state.equipOnUnstash` is populated
  lazily by the reducer the first time an item is stashed; there's no historical value to backfill
  for existing characters.
- Must not conflict with or duplicate `equipped` at the data level: stashing *does* force
  `equipped` to `false` (via the reducer, not by deleting the stored value) — un-stashing restores
  it from `_state.equipOnUnstash` automatically.

## Domain Notes

**Stash** and **Equipped** are now defined in `CONTEXT.md` (added alongside this doc). Summary:
`Equipped` (`ItemData.equipped`) says a *present* item is actively worn/wielded; `Stash`
(`ItemData.stashed`) says an item isn't with the Runner at all right now. The gear reducer forces
`equipped` to `false` the moment `stashed` becomes `true`, remembering the prior value internally
so un-stashing restores it — from a reader's perspective the two still read as independent axes
(an item can be present, unequipped, and not stashed all at once, e.g. a spare pistol in a
holster), but the enforcement now lives in the reducer rather than at every call site.

## Rough Interface Sketches

_High-level shapes only — no implementation code._

```ts
interface ItemData {
  // ...existing fields (fixed, wireless stay top-level, unchanged)
  equipped?: boolean
  stashed?: boolean

  // Internal — the gear reducer's Stash/Equip bookkeeping, not read directly.
  _state?: {
    equipOnUnstash?: boolean
  }
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
