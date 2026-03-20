// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CharacterMigration<TInput, TOutput> {
  version: number
  up: (character: TInput) => TOutput | Promise<TOutput>
}
