# SessionApi for Tab-Scoped Transient State

## Status

Open — not yet needed. Noted for future consideration.

## Background

All `RunnerData` state — including combat-round data like initiative rolls and passes completed —
is currently written to the active `StorageSource` (localStorage) on every change. This is
intentional: a page reload during combat does not lose state.

The downside is that combat state bleeds across browser sessions. Opening the same character in a
new tab (or a week later) will show the initiative from the last session.

## Proposed Upgrade

Introduce a `SessionApi` backed by the browser's `sessionStorage` to hold state that should be
tab-scoped and automatically discarded when the tab closes. Candidates for this tier:

- Initiative rolls and passes completed
- Active sustained spell tracking (once modelled separately from RunnerData)
- Any other "this combat only" flags

## Design Questions

1. Which fields on `RunnerData` should move to `SessionApi` vs. stay on the persistent store?
2. Should `SessionApi` be a second storage source in `CharacterManager`, or a separate abstraction
   entirely (since it doesn't need migration, indexing, or ID-based lookup)?
3. How does the Viewer's `useCharacterSheet` selector interact with session state — merged view,
   or separate hooks?

## Related

- `src/system/characterSheet.ts` — `RunnerData.initiative` field
- `src/lib/storage/` — pluggable storage layer
- `CONTEXT.md` — Session State term definition
