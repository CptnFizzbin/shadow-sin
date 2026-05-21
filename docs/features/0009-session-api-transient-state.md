# SessionApi for Tab-Scoped Transient State

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

All `RunnerData` state — including combat-round data like initiative rolls and passes completed —
is currently written to the active `StorageSource` on every change. This is intentional: a page
reload during combat does not lose state. The downside is that combat state bleeds across browser
sessions — opening a Runner a week later shows the initiative values from the last session.

The proposed upgrade introduces a `SessionApi` backed by `sessionStorage` to hold state that
is tab-scoped and automatically discarded when the tab closes.

**Candidates for the session tier:**
- Initiative rolls and passes completed
- Active sustained spell tracking (once modelled separately from `RunnerData`)
- Any other "this combat only" flags

## Open Questions

- [ ] Which specific fields on `RunnerData` should move to `SessionApi` vs. stay on the
      persistent store?
- [ ] Should `SessionApi` be a second `StorageSource` in `CharacterManager`, or a separate
      abstraction (it doesn't need migration, indexing, or ID-based lookup)?
- [ ] How does `useCharacterSheet` interact with session state — merged view, or separate hooks?

## Constraints

- The current behaviour (state persists across reloads) is intentional and must be preserved for
  fields that stay on the primary `StorageSource`.
- `SessionApi` must not require migration — session data is ephemeral and has no schema version.
- This must not break the existing `StoreSlice` / `useCharacterSheet` subscription pattern.

## Domain Notes

- **Session State** — combat-round and in-session data currently stored on `RunnerData`;
  persisted to the active `StorageSource` on every change
- **StorageSource** — named persistence backend; `localStorage` today, `sessionStorage` proposed
  for this feature

## Out of Scope

- Cross-device session synchronisation
- Session history or session replay
- Any state that legitimately needs to persist across browser sessions

## Related Features

- [`docs/features/0003-gm-game.md`](./0003-gm-game.md) — Game sync overlaps with the
  persistent-vs-transient state boundary
- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — Entity/Vehicle
  damage may belong in the session tier
