export interface CharacterMigration<TInput extends object, TOutput extends object = TInput> {
  /** Identifier in yyyymmdd format, used for ordering migrations. */
  id: string
  up: (character: TInput & Partial<TOutput>) => TOutput
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCharacterMigration = CharacterMigration<any, any>
