/**
 * Describes a single migration step for the character builder draft state
 * stored in localStorage. Mirrors the shape of CharacterMigration for
 * PlayerCharacterData so the two systems can evolve in parallel.
 */
export interface FormStateMigration<TInput, TOutput> {
  /** Semantic version string (e.g. "1.0.0") that this migration produces. */
  version: string
  up: (state: TInput) => TOutput
}
