export interface CharacterMigration<TData extends object = object> {
  /** Sequential migration number — also the value `_meta_.version` reaches once this migration has run. */
  version: number
  up: (character: Partial<TData> & { _meta_?: { version?: number } }) => TData
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCharacterMigration = CharacterMigration<any>

/**
 * True when `character` is already at or past the given migration version —
 * i.e. this migration's changes have already been applied.  Every migration
 * checks this at the top of `up` so `applyMigrations` can call every
 * migration unconditionally instead of filtering a separate applied-ids
 * list.
 */
export function migrationAlreadyApplied(
  character: { _meta_?: { version?: number } },
  version: number,
): boolean {
  return (character._meta_?.version ?? 0) >= version
}
