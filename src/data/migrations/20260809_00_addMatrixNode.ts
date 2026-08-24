import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const migration: CharacterMigration<{
  matrix?: {
    name?: string
    system?: number
    firewall?: number
    response?: number
    signal?: number
    numberOfPrograms?: number
  }
}> = {
  timestamp: "2026-08-09T12:08:52Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft.matrix ??= {}
      draft.matrix.name ??= ""
      draft.matrix.system ??= 0
      draft.matrix.firewall ??= 0
      draft.matrix.response ??= 0
      draft.matrix.signal ??= 0
      draft.matrix.numberOfPrograms ??= 0
    })
  },
}

export default migration
