import { produce } from "immer"

import type { CharacterMigration } from "#/runner/characterMigration.ts"

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
  id: "20260509",
  up: produce((draft) => {
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
  }),
}

export default migration
