import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { JsonObject } from "#/lib/jsonUtils.ts"

const VERSION = 14

interface OldShape {
  adeptPowers?: JsonObject[]
  powers?: JsonObject[]
}

const migration: CharacterMigration<OldShape> = {
  version: VERSION,
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
