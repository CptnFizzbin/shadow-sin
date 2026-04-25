import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

const migration: CharacterMigration<any, any> = {
  id: "20260424",
  up: (draft) =>
    produce(draft, (d) => {
      d.spirits ??= []
    }),
}

export default migration
