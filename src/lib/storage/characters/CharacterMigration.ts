import type { SemVer } from "#/lib/system/types/characterSheet.ts"

export interface CharaterSheetStub {
  id: string
  version: SemVer
}

export interface CharacterMigration<
  TInput extends CharaterSheetStub,
  TOutput extends CharaterSheetStub,
> {
  /** Semantic version string (e.g. "1.0.0") that this migration produces. */
  version: SemVer
  up: (character: TInput) => TOutput | Promise<TOutput>
}
