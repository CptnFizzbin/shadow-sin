export interface CharacterMigration<TInput, TOutput> {
  /** Semantic version string (e.g. "1.0.0") that this migration produces. */
  version: string
  up: (character: TInput) => TOutput | Promise<TOutput>
}
