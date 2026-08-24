export interface CharacterMigration<TData extends object = object> {
  /**
   * ISO 8601 timestamp of this migration's creation, including a UTC offset/timezone (e.g. the
   * `Z` suffix or a `+HH:MM`/`-HH:MM` offset) — comparisons (`src/data/applyMigrations.ts`) parse
   * it as an absolute instant, not a naive local date. A runner's `_meta_.appVersion` reaches (at
   * least) this value once the migration has run.
   */
  timestamp: string
  up: (character: Partial<TData>) => TData
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCharacterMigration = CharacterMigration<any>
