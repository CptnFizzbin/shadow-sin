import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { JsonObject } from "#/lib/jsonUtils.ts"

interface OldShape {
  adeptPowers?: JsonObject[]
  powers?: JsonObject[]
}

const migration: CharacterMigration<OldShape> = {
  timestamp: "2026-05-10T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      if ("adeptPowers" in draft) {
        const mapped = (draft.adeptPowers ?? []).map((power) => {
          power.type = "adeptPower"
          return power
        })
        draft.powers = [...(draft.powers ?? []), ...mapped]
        delete draft.adeptPowers
      }
    })
  },
}

export default migration
