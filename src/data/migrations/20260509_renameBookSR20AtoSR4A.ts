import { produce } from "immer"

<<<<<<<< HEAD:src/data/migrations/20260509_renameBookSR20AtoSR4A.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
import type { CharacterMigration } from "#/runner/characterMigration.ts"
>>>>>>>> shadowrun-4e:src/runner/migrations/20260509_renameBookSR20AtoSR4A.ts

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
