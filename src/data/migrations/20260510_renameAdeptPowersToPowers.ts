import { produce } from "immer"

<<<<<<<< HEAD:src/data/migrations/20260510_renameAdeptPowersToPowers.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
>>>>>>>> shadowrun-4e:src/runner/migrations/20260510_renameAdeptPowersToPowers.ts
import type { JsonObject } from "#/lib/jsonUtils.ts"
import type { CharacterMigration } from "#/runner/characterMigration.ts"

interface OldShape {
  adeptPowers?: JsonObject[]
  powers?: JsonObject[]
}

const migration: CharacterMigration<OldShape> = {
  id: "20260510",
  up: produce((draft) => {
    if ("adeptPowers" in draft) {
      const mapped = (draft.adeptPowers ?? []).map((power) => {
        power.type = "adeptPower"
        return power
      })
      draft.powers = [...(draft.powers ?? []), ...mapped]
      delete draft.adeptPowers
    }
  }),
}

export default migration
