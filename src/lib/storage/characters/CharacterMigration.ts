// biome-ignore lint/correctness/noUnusedVariables: not yet used, but will be in future migrations
interface CharacterMigration<TInput, TOutput> {
	version: number;
	up: (character: TInput) => TOutput | Promise<TOutput>;
}
