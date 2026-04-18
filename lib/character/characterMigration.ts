export interface CharacterMigration<TData extends object = object> {
  id: string
  up: (character: Partial<TData>) => TData
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCharacterMigration = CharacterMigration<any>
