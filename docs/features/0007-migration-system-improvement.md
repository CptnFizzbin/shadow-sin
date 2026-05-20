# Improve Migration System

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

The current migration system tracks applied migrations as an array of string IDs in
`CharacterMeta.appliedMigrations`. This has known design limitations:

1. **No single source of truth for schema version** — determining how up-to-date a `RunnerData`
   record is requires diffing the stored ID list against the registered migration list.
2. **ID-based ordering is fragile** — migrations sort by string ID (date-prefix convention), so
   a mis-named migration can silently run out of order.
3. **No library-level guarantees** — the current `applyMigrations.ts` is hand-rolled with no
   transaction-like semantics, error reporting, or execution pipeline guarantees.

**Desired state:**
- A single integer **schema version** on `RunnerData` that unambiguously describes how far
  through the migration chain a record has been transformed.
- Migrations applied in strictly sequential version order; any record below the current app
  version runs all outstanding migrations in sequence.
- Old migrations remain untouched after commit.

## Open Questions

- [ ] Should the schema version replace `appliedMigrations` entirely, or wrap it for backwards
      compatibility?
- [ ] Is [umzug](https://github.com/sequelize/umzug) or a similar library the right fit, or is
      a well-structured hand-rolled solution sufficient?
- [ ] What is the migration path for existing RunnerData records that have `appliedMigrations`
      but no `schemaVersion`?

## Constraints

- **Never edit an existing migration file.** Once committed, a migration may have already run
  against real user data. Bugs in a migration are fixed by writing a new migration.
- Migrations operate on potentially invalid or incomplete data — each migration must only
  understand the shape it receives, not the final shape.
- The Attachment field rename (`childIds` → `attachmentIds`, `parentId` → `attachedToId`) should
  land **after** this system is in place so it can use the new version scheme from the start.

## Domain Notes

- **Migration** — a single, immutable schema-upgrade step transforming one version of
  `RunnerData` into the next
- **CharacterMeta** — versioning metadata in every `RunnerData` record; currently holds
  `appliedMigrations`

## Out of Scope

- Migrations for storage backends other than `RunnerData` (e.g. app config, game settings)
- Downgrade / rollback migrations

## Related Features

- [`docs/features/0006-game-effect-resolution-model.md`](./0006-game-effect-resolution-model.md)
  — also tracked in migration improvement notes as a dependency
- [`docs/features/0002-additional-build-modes.md`](./0002-additional-build-modes.md) — adding
  `BuildMode` to `RunnerData` should use the improved version scheme
