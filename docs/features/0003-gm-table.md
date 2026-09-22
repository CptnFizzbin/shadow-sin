# GM Table — Multi-Player Runner Grouping

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

Currently ShadowSIN is a single-player tool: each Player manages their own Runners independently.
A **Table** is a GM-managed group that links multiple Players and their Runners together. The GM
creates a Table, Players join it, and the GM gets a shared view of all Runners in the group.

## Open & Resolved Questions

Resolved items are marked `[x]` with the decision inline; unresolved ones keep `[ ]` and explain
what's still in the air.

- [x] **Storage — a new, independent `StorageSource` backed by a dedicated server
      (`api.shadowsin.app`), written in C#.** Not tied to Table membership: a Player may use it
      as a plain cloud `StorageSource` for their own Runners (parallel to `local`/`gdrive`) with
      no Table involved at all. Requires a Player Account (see Identity & auth below) — Runners
      in cloud storage are owned by an Account, not anonymous.
- [x] **Runner ownership — cloud storage is a prerequisite for adding a Runner to a Table, and
      Table membership does not create a second copy.** A Runner must already live in the cloud
      `StorageSource` (i.e. already have a cloud `RunnerId`) before it can be added to a Table;
      the Table then references that Runner by its existing `RunnerId` rather than copying it
      into separate Table-scoped storage. Moving a Runner from `local`/`gdrive` into the cloud
      source is a normal cross-source copy and mints a new `RunnerId`, same as any other
      `StorageSource` change today — but that happens once, on the way into cloud storage, not
      again on the way into a Table.
- [x] **Identity & auth — account-based, with a Table-scoped Invite Code.** Every user (GM and
      Player alike) has an Account on `api.shadowsin.app` and logs in — there is no anonymous
      access. A Table is created by a GM Account; that GM gets an **Invite Code** to share, which
      a Player uses (while logged into their own Account) to add one of their cloud-stored
      Runners to the Table. The Invite Code is how a Player *finds* a Table, not how they prove
      *who* they are — that's the Account's job.
- [ ] **GM permissions** — can the GM edit Runners, or is GM access read-only?
- [ ] **Real-time sync** — do Player changes appear live in the GM view, or as a snapshot?
- [ ] **Offline play** — what happens when a Player is offline during a session?

## Constraints

- The existing `StorageSource` abstraction must accommodate a new cloud source (backed by
  `api.shadowsin.app`) without breaking per-Player local storage.
- A Runner copied to the cloud source must receive a new `RunnerId` (new UUID + new source
  prefix) — a copy is a distinct Runner, not a replica. Adding an already-cloud-stored Runner to
  a Table does not mint another new `RunnerId` — see Runner ownership above.
- Google Drive integration currently exists only as a placeholder stub; unrelated to this
  feature, which introduces its own separate cloud source instead of building on `gdrive`.

## Domain Notes

- **Table** — a GM-managed group linking Players and their Runners
- **Game Master (GM)** — creates and manages the Table
- **Player** — joins a Table; manages their own Runners within it
- **StorageSource** — named, pluggable persistence backend; this feature introduces a new cloud
  source backed by `api.shadowsin.app`
- **RunnerId** — `source|uuid`; copying a Runner to a new source always generates a new ID

## Out of Scope

- GM tooling beyond viewing Runners (e.g. encounter management, NPC sheets)
- Multiple Tables per Player in the initial implementation
- Conflict resolution if two Players edit the same Runner simultaneously

## Related Features

- [`docs/features/0009-session-api-transient-state.md`](./0009-session-api-transient-state.md)
  — Session State design overlaps with Table sync (what is shared vs. tab-local)
