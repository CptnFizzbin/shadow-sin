# Item Stashing

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

A general, persisted way to mark a piece of carried gear as unavailable for a given run — "left at
the safehouse" — without deleting it or leaving the Builder. Discovered as a dependency while
designing [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md): that
feature originally prototyped "stashing" as local, single-dialog state, but the mechanic clearly
belongs on the item itself, since a stashed item should read as unavailable everywhere a Runner's
gear is shown, not just inside one dialog.

## Resolved Decisions

- **Persistence:** a new optional field, `ItemData.stashed?: boolean`. Not local dialog state —
  it lasts until explicitly toggled back.
- **Equip interaction:** a stashed item cannot be equipped. (Exact enforcement point — form
  validation, disabled control, or both — is an implementation detail, not a design open
  question.)
- **Gear-list presentation:** a stashed item is greyed out and sorted to the bottom of its gear
  listing, rather than hidden.
- **Parent/child cascade:** stashing a parent item (e.g. a weapon with attachments) cascades to
  all of its children — you can't stash the gun but keep the scope active. A child cannot be
  independently un-stashed while its parent is stashed, since the whole assembly is already
  excluded. A child *can* be stashed independently of an active (non-stashed) parent — e.g.
  stashing just the scope while keeping the gun in play.
- [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md) consumes this
  flag directly: its per-run checklist reflects (and can toggle) `stashed` rather than keeping its
  own local exclusion state.

## Open Questions

- [ ] **Where does the toggle live?** A control on the item card itself (e.g. next to the existing
      `equipped` toggle), a kebab-menu action, or a bulk action from the gear list? No UI location
      has been chosen yet.
- [ ] **Builder vs. Viewer:** does stashing apply in both modes, or only the Viewer (in-play)? A
      Builder is assembling a Runner's full loadout, where "left at the safehouse" arguably doesn't
      apply yet — but License Check itself is Viewer-only (see 0011), which may mean stashing only
      needs to exist in the Viewer for v1.
- [ ] **Encumbrance interaction:** `encumbranceUtils.ts` currently derives penalties from
      `equipped` armor. Should a stashed item be force-excluded from encumbrance/weight
      calculations (since it's not being carried), independent of its `equipped` value, or does
      `equipped` already imply that and `stashed` never needs to interact with it?
- [ ] **Nuyen/BP interaction:** does stashing an item change how it's counted in Builder budgets,
      or does stash only ever apply in the Viewer, making this moot (see the Builder/Viewer
      question above)?

## Constraints

- `ItemData.equipped` is an existing, per-item-type opt-in field (only weapons and armor forms
  currently set `equipable: { forced: true }`). `stashed` is a separate field and is not gated by
  the same per-item-type opt-in — it should be available on every `ItemData`, since any gear
  (including SINs' covered Licences, per 0011) can be left behind.
- Must not conflict with or duplicate `equipped` — a stashed item should not also need to be
  explicitly un-equipped by the Player; stashing forces the equip state, not the other way around.

## Domain Notes

- **Stash** — marking a carried item as unavailable for the current context ("left at the
  safehouse"), via a persisted `ItemData.stashed` flag. Distinct from `equipped`: `equipped` says
  an item is actively worn/wielded; `stashed` says it isn't with the Runner at all right now.

## Rough Interface Sketches

_High-level shapes only — no implementation code._

```ts
interface ItemData {
  // ...existing fields
  stashed?: boolean
}
```

## Out of Scope

- Any UI location decision (item card control vs. kebab menu vs. bulk action) — pending the "where
  does the toggle live?" open question above.
- Interaction with Builder budgets (BP, Nuyen, Availability) — pending the Builder/Viewer open
  question above.
- Any License-Check-specific behavior — that lives entirely in
  [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md); this feature
  only defines and persists the flag itself.

## Related Features

- [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md) — the feature
  that surfaced this as a dependency; License Check's per-run checklist reads and toggles
  `stashed` rather than keeping its own local state
