import { produce } from "immer"

<<<<<<<< HEAD:src/data/migrations/20260425_addSpiritDamage.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
import type { CharacterMigration } from "#/runner/characterMigration.ts"
>>>>>>>> shadowrun-4e:src/runner/migrations/20260425_addSpiritDamage.ts

const migration: CharacterMigration<{ spirits?: Array<Record<string, unknown>> }> = {
  id: "20260425",
  up: produce((draft) => {
    if (!Array.isArray(draft.spirits)) return
    for (const spirit of draft.spirits) {
      if (typeof spirit.damage === "undefined") {
        spirit.damage = { physical: 0, stun: 0 }
      }
    }
  }),
}

export default migration
