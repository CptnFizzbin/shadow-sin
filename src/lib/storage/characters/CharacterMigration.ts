interface CharacterMigration<TInput, TOutput> {
  version: number;
  up: (character: TInput) => TOutput | Promise<TOutput>;
}