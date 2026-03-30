export interface CharacterMigration<TInput extends { version: string }, TOutput extends { version: string }> {
  version: string
  up: (character: TInput) => TOutput | Promise<TOutput>
}
