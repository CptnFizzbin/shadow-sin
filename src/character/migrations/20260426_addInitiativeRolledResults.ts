import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

// Adds CharacterSheet.initiative optional fields: rolledResults, goingFirst, extraPasses — no data transform needed, migration registers the ID
const migration: CharacterMigration = {
  id: "20260426",
  up: produce(() => {}),
}

export default migration
