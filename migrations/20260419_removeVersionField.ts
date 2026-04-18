import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

interface Input {
  version?: string
}

const migration: CharacterMigration<Input & Record<string, unknown>> = {
  id: "20260419",
  up: ({ version: _version, ...rest }) => rest,
}

export default migration
