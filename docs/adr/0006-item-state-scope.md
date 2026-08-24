# `ItemData._state` scope: Stash/Equip bookkeeping only, no general mirror

`equipped` and `stashed` are plain top-level fields on `ItemData` — not nested under `_state`.
`_state` holds a single field, `equipOnUnstash?: boolean`: internal bookkeeping the gear reducer
uses to make Stash and Equip interact correctly, not a general internal mirror of the two public
fields.

The moment `stashed` becomes `true` (via `Actions.item.setStashed`, or a `setItem`/`patchItem`
write from the item edit form), the gear reducer (`../../src/stores/runner/gear/gearSlice.ts`)
forces `equipped` to `false` and records whatever it was into `_state.equipOnUnstash`. Un-stashing
reads that value back to restore `equipped` automatically, then clears it. This makes
`item.equipped` always trustworthy on its own — readers never need to also check `!item.stashed`,
and `isEquipped`/`isStashed` (`src/system/items/itemUtils.ts`) are deprecated in favor of reading
the fields directly.

`fixed` and `wireless` stay top-level, uninvolved in any of this — they don't interact with Stash
the way Equipped does.

## History

This ADR originally specified `_state: { equipped, stashed }` as a nested, internal-only pair
mirroring the two public fields, with `isEquipped(item) && !isStashed(item)` composed at every
read site and no combined helper — reasoning that a missed call site could otherwise let a stashed
item's effects silently stay active. Review on #471 pushed back on the size of the resulting diff
and proposed the current design instead: keep `equipped`/`stashed` as the plain top-level fields
they always were, and let the reducer enforce the invariant once, at the write boundary, rather
than at every read site. `equipOnUnstash` is what's left of the original `_state` idea — internal
storage, not part of the public read surface — narrowed to the one thing that still needs it:
remembering a value that's about to be overwritten so it can come back later.
