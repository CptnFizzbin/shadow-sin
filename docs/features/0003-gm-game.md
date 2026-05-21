# GM Game — Multi-Player Runner Grouping

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

Currently ShadowSIN is a single-player tool: each Player manages their own Runners independently.
A **Game** is a GM-managed group that links multiple Players and their Runners together. The GM
creates a Game, Players join it, and the GM gets a shared view of all Runners in the group.

## Open Questions

- [ ] **Identity & auth** — how are Players and GMs identified? Login system, or shared
      link/code?
- [ ] **Storage** — where does a Game and its member list live? LocalStorage is per-device, so
      this likely requires a backend or shared cloud storage source (e.g. Google Drive).
- [ ] **Runner ownership** — when a Runner joins a Game, does it stay in the Player's
      `StorageSource`, or is it copied/moved to shared Game storage? How does the `CharacterId`
      `source` prefix work in this context?
- [ ] **GM permissions** — can the GM edit Runners, or is GM access read-only?
- [ ] **Real-time sync** — do Player changes appear live in the GM view, or as a snapshot?
- [ ] **Offline play** — what happens when a Player is offline during a session?

## Constraints

- The existing `StorageSource` abstraction must accommodate a new shared Game source without
  breaking per-Player local storage.
- A Runner copied to a shared source must receive a new `CharacterId` (new UUID + new source
  prefix) — a copy is a distinct Runner, not a replica.
- Google Drive integration currently exists only as a placeholder stub; it may need to be
  completed or replaced before this feature is feasible.

## Domain Notes

- **Game** — a GM-managed group linking Players and their Runners
- **Game Master (GM)** — creates and manages the Game
- **Player** — joins a Game; manages their own Runners within it
- **StorageSource** — named, pluggable persistence backend; a Game would introduce a new source
- **CharacterId** — `source|uuid`; copying a Runner to a new source always generates a new ID

## Out of Scope

- GM tooling beyond viewing Runners (e.g. encounter management, NPC sheets)
- Multiple Games per Player in the initial implementation
- Conflict resolution if two Players edit the same Runner simultaneously

## Related Features

- [`docs/features/0009-session-api-transient-state.md`](./0009-session-api-transient-state.md)
  — Session State design overlaps with Game sync (what is shared vs. tab-local)
