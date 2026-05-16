# GM Game — Multi-Player Runner Grouping

## Status

Open — stub for future design. No implementation exists.

## Background

Currently ShadowSIN is a single-player tool: each Player manages their own Runners
independently. There is no way for a GM to view or manage all Runners in a group together.

## Planned Feature

A **Game** is a GM-managed group that links multiple Players and their Runners. The GM creates
a Game, Players join it, and the GM gets a shared view of all Runners in that group.

## Design Questions

1. **Identity & auth** — how are Players and GMs identified? Is there a login system, or is
   the Game accessed via a shared link/code?
2. **Storage** — where does a Game and its member list live? LocalStorage is per-device, so
   this likely requires a backend or a shared cloud storage source (e.g. Google Drive).
3. **Runner ownership** — when a Runner joins a Game, does it stay in the Player's
   `StorageSource`, or is it copied/moved to a shared Game storage? How does the `CharacterId`
   `source` prefix work in this context?
4. **GM permissions** — can the GM edit Runners, or is access read-only?
5. **Real-time sync** — do changes a Player makes to their Runner appear live in the GM view,
   or is it a snapshot?
6. **Offline play** — what happens when a Player is offline during a session?

## Related

- `src/lib/storage/` — pluggable storage layer; a Game storage source would need a new provider
- `src/integrations/googleDrive/api.ts` — Google Drive stub (potential shared storage backend)
- `CONTEXT.md` — Game, GM, Player term definitions
- `docs/issues/session-api-transient-state.md` — Session State design (overlaps with Game sync)
