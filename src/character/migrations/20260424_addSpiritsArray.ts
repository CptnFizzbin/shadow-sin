import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

const migration: CharacterMigration<any, any> = {
  id: "20260424",
  up: (draft: any) =>
    produce(draft, (d: any) => {
      d.spirits ??= []
    }),
}

export default migration
