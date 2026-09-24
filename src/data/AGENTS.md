# src/data — Runner schema migrations

Migrations live in `migrations/` and are registered in `migrations.ts`; `applyMigrations.ts` decides which ones run
(every migration whose `timestamp` is newer than the runner's `_meta_.sinVersion`, in ascending order). Read both
before adding one.

**Never edit an existing migration file.** Once committed, it may already have run against real character data in
user storage; changing its logic would behave differently on a re-run and could corrupt or silently mis-migrate
characters.

- **Schema changes always require a new migration** — whenever a `RunnerData` field is added, renamed, or removed.
- **Naming:** `<date>_<seq>_describeChange.ts`, where `<date>` is the current UTC date as `YYYYMMDD`
  (`date -u +%Y%m%d`) and `<seq>` is a two-digit counter for that day starting at `00` (e.g. `20260824_00_addFoo.ts`).
  Register it at the bottom of `migrations.ts`.
- **Timestamp:** set `timestamp` to the actual creation instant as an ISO 8601 string with a UTC offset (e.g.
  `"2026-08-24T15:30:00Z"`). It must sort after every existing migration — `migrations.ts` throws at import time
  otherwise, and CI (`migration-timestamps`) rejects a timestamp that isn't newer than the base branch's latest, since
  such a migration would never run for already-migrated runners.
- **Every migration must be idempotent** — runners from the pre-timestamp versioning scheme can re-run every
  registered migration once. Guard with a shape check (`??=`, or return early once the migrated shape is detected).
- **Don't re-check `_meta_.sinVersion` inside `up`** — `applyMigrations` already only calls `up` when it's pending.
- **Earlier migrations may see either field name** — when a migration renames a field, update earlier migrations to
  handle both (`draft.oldField ?? draft.newField`) so partially migrated runners stay correct.
- **Add a matching `*.test.ts`** for every new migration, documenting the before/after shapes.
