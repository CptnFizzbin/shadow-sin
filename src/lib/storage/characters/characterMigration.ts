export interface BaseCharacterMetadata {
  version: string
}

export interface CharacterMigration<TInput extends BaseCharacterMetadata, TOutput extends BaseCharacterMetadata> {
  version: string
  up: (character: TInput & Partial<TOutput>) => TOutput
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCharacterMigration = CharacterMigration<any, any>
