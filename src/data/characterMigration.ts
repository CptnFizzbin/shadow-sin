export interface CharacterMigration<TData extends object = object> {
  /** Sequential migration number — also the value `_meta_.version` reaches once this migration has run. */
  version: number
  up: (character: Partial<TData>) => TData
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCharacterMigration = CharacterMigration<any>
