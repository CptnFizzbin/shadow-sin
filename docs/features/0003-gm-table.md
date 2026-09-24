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
- [x] **Account credentials — username + password, or a Passkey, for v1.** No third-party OAuth
      in the first version; `api.shadowsin.app` owns credential storage/verification itself
      (password hashing, or WebAuthn passkey registration/verification). Both methods are
      available from v1 — a user picks either at signup.
- [x] **GM permissions — read-only for now.** The GM can view every Runner in the Table but
      cannot edit them from the Table view. Revisit if a future need for GM edits emerges — not
      designed against today.
- [x] **Real-time sync — snapshots in phase 1, live updates in phase 2.** Phase 1: the GM view
      shows each Runner as of when the GM loaded or refreshed it. Phase 2 adds live push over
      WebSockets so Player changes appear without a refresh.
- [x] **Offline play — local-first, sync on reconnect.** A cloud-stored Runner keeps a local
      copy; edits save locally as they happen and are pushed to `api.shadowsin.app` once the
      connection returns. Being offline never blocks editing.
- [x] **Sync conflicts — reject and ask.** Each cloud Runner carries a server-side revision. A
      push based on an older revision than the server holds is rejected, and the Player chooses
      whether to keep this device's version or the server's. Nothing is silently overwritten. A
      smarter resolution (e.g. replaying edits) may replace this later.

- [x] **Where the server code lives — this repo, restructured as a monorepo.** The SPA moves to
      `packages/client`, and the C# server lives in `packages/server`. See
      `docs/adr/0018-monorepo-client-and-server.md`.

- [x] **How the server treats `RunnerData` — as an opaque document.** The server stores each
      Runner's JSON as-is and reads only the few fields it needs (owner Account, revision, name,
      SIN Version). The client keeps sole ownership of the schema and its Migrations, and migrates
      a Runner after loading it from the server, the same as from any other `StorageSource`. See
      `docs/adr/0019-server-stores-runner-data-opaquely.md`.

- [x] **Database — SQLite for phase 1.** A single database file next to the server. That limits
      phase 1 to one server instance on a host with a persistent disk. Revisit when phase 2 adds
      WebSockets or if more than one instance is ever needed.

- [x] **Hosting — an existing DigitalOcean VPS, deployed with Docker Compose.** The server ships
      as a Docker image and runs under Docker Compose on the VPS. The SQLite file lives on a
      mounted volume, so it survives container rebuilds. The client stays on GitHub Pages, so the
      server has to allow cross-origin requests from the client's origin.

- [x] **Staying logged in — an HttpOnly session cookie.** After login, `api.shadowsin.app` sets
      a `Secure`, `HttpOnly`, `SameSite=Lax` session cookie, and the client sends it with
      credentialed requests. The client (`shadowsin.app`) and the server (`api.shadowsin.app`)
      are the same site, so the cookie works without cross-site workarounds. The server accepts
      credentialed cross-origin requests from `https://shadowsin.app` only.

- [x] **Server stack — .NET 10 with ASP.NET Core Minimal APIs, EF Core, and ASP.NET Core
      Identity.** Identity provides Accounts, password hashing, passkeys, and the session cookie.
      EF Core, on its SQLite provider for phase 1, keeps a later move to another database mostly a
      provider swap.

## Constraints

- The server is fully optional. Every existing feature must keep working with no server and no
  Account; only cloud storage and Tables depend on it.

- The existing `StorageSource` abstraction must accommodate a new cloud source (`api.shadowsin.app`)
  without breaking per-Player local storage.
- Moving a Runner into the cloud source mints a new `RunnerId`, same as any cross-source copy;
  adding it to a Table afterward does not mint another one — see Runner ownership above.
- Google Drive integration is an unrelated placeholder stub — this feature adds its own cloud
  source rather than building on `gdrive`.

## Domain Notes

- **Table** — a GM-managed group linking Players and their Runners
- **Game Master (GM)** — creates and manages the Table
- **Player** — joins a Table; manages their own Runners within it
- **Account** — a login identity on `api.shadowsin.app`; every GM and Player has one
- **Invite Code** — a Table-scoped code that lets a Player join a Table; identifies which Table,
  not who's joining
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
