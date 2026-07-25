# `ItemData._state` scope: only Equipped and Stash, no combined helper

`ItemData._state` groups only `equipped` and `stashed` — not `fixed` or `wireless`, even though
all four are per-item booleans. Equipped and Stash combine (`isEquipped(item) &&
!isStashed(item)` determines whether Equipped's mechanical effect is actually active); `fixed`
and `wireless` don't interact with anything else today, so they stay top-level fields on
`ItemData` rather than joining `_state`. The leading underscore marks `_state` as internal
storage (same convention as `RunnerData._meta_`), read through `isEquipped(item)` /
`isStashed(item)` in `src/system/items/itemUtils.ts` rather than directly.

There is deliberately no `isActivelyEquipped`-style combinator wrapping the two checks — call
sites compose `isEquipped(item) && !isStashed(item)` inline. If `fixed` or `wireless` later grow
their own cross-flag logic, they can join `_state` at that point; until then, folding them in
speculatively would be scope creep with no behavior to justify it.
