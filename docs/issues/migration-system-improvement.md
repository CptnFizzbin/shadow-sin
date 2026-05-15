# Improve Migration System

## Status

Open — current system is functional but has known design limitations.

## Problem

The current migration system tracks which migrations have run by storing an array of string IDs
in `CharacterMeta.appliedMigrations`. This has several issues:

1. **No single source of truth for schema version** — determining "how up-to-date is this
   RunnerData?" requires diffing the stored ID list against the registered migration list, rather
   than comparing a single integer.
2. **ID-based ordering is fragile** — migrations sort by string ID (date-prefix convention), so
   a mis-named migration can silently run out of order.
3. **No library-level guarantees** — the current `applyMigrations.ts` is hand-rolled. A library
   such as [umzug](https://github.com/sequelize/umzug) provides transaction-like semantics,
   better error reporting, and a well-tested execution pipeline.

## Desired State

- A single integer **schema version** on `RunnerData` (replacing or wrapping `appliedMigrations`)
  that unambiguously describes how far through the migration chain a record has been transformed.
- Migrations are applied in strictly sequential version order; any record below the current app
  version runs all outstanding migrations in sequence.
- Old migrations remain **untouched** after commit. They operate on potentially invalid or
  incomplete data by design — each migration only needs to understand the shape it receives, not
  the final shape.

## Notes

- The current `AGENTS.md` convention says earlier migrations should be updated to handle both old
  and new field names when a later migration renames a field. **This convention is superseded by
  the desired state above** — once the version-based system is in place, each migration is
  isolated to its input version and old migrations stay frozen.
- The Attachment field rename migration (`childIds` → `attachmentIds`, `parentId` →
  `attachedToId`) should be implemented **after** this system is in place so it can use the new
  version scheme from the start.

## Related

- `src/character/applyMigrations.ts` — current implementation
- `src/character/migrations.ts` — migration registry
- `src/character/characterMigration.ts` — `CharacterMigration<T>` interface
- `src/system/characterSheet.ts` — `CharacterMeta` (holds `appliedMigrations`)
- `CONTEXT.md` — Migration term definition
- `docs/issues/game-effect-resolution-model.md`
