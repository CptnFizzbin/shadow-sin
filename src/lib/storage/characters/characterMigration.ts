export interface BaseCharacterMetadata {
  version: string
}

export interface CharacterMigration<TInput extends object, TOutput extends object = TInput> {
  version: string
  up: (character: BaseCharacterMetadata & TInput & Partial<TOutput>) => TOutput
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCharacterMigration = CharacterMigration<any, any>
