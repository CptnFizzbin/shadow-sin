import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { migrationAlreadyApplied } from "#/data/characterMigration.ts"

const VERSION = 13

type WithSource = Record<string, unknown> & {
  source?: { book?: string }
}

function renameBookInPlace(item: WithSource): void {
  if (item.source?.book === "SR20A") {
    item.source.book = "SR4A"
  }
}

type OldCharacter = {
  gear?: Record<string, WithSource>
  qualities?: WithSource[]
  spells?: WithSource[]
  adeptPowers?: WithSource[]
  sprites?: WithSource[]
}

const migration: CharacterMigration<OldCharacter> = {
  version: VERSION,
  up: (character) => {
    if (migrationAlreadyApplied(character, VERSION)) return character as OldCharacter

    return produce(character, (draft) => {
      if (draft.gear) {
        for (const item of Object.values(draft.gear)) {
          renameBookInPlace(item)
        }
      }

      for (const collection of [draft.qualities, draft.spells, draft.adeptPowers, draft.sprites]) {
        if (Array.isArray(collection)) {
          for (const item of collection) {
            renameBookInPlace(item)
          }
        }
      }
    })
  },
}

export default migration
