import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

type OldShape = {
  adeptPowers?: unknown[]
  powers?: unknown[]
}

const migration: CharacterMigration<OldShape> = {
  id: "20260510",
  up: produce((draft) => {
    if ("adeptPowers" in draft) {
      draft.powers = draft.adeptPowers ?? []
      delete draft.adeptPowers
    }
  }),
}

export default migration
