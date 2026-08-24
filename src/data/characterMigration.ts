export interface CharacterMigration<TData extends object = object> {
  /**
   * ISO 8601 timestamp of this migration's creation. A runner's `_meta_.appVersion` reaches (at
   * least) this value once the migration has run — see `src/data/applyMigrations.ts`.
   */
  timestamp: string
  up: (character: Partial<TData>) => TData
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCharacterMigration = CharacterMigration<any>
