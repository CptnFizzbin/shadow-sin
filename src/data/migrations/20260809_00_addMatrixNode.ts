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
  gameState?: {
    matrix?: unknown
  }
}> = {
  timestamp: "2026-08-09T12:08:52Z",
  up: (character) => {
    return produce(character, (draft) => {
      // A runner that already has `gameState.matrix` has already been through this migration (or
      // through `20260809_02_addMatrixGameState`, which converts this scaffold into it) — stubbing
      // a fresh `matrix` here would just hand that migration bogus data to convert all over again.
      if (draft.gameState?.matrix) return

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
