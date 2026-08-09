import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 25

interface OldMatrixNode {
  name?: string
  system?: number
  firewall?: number
  response?: number
  signal?: number
  numberOfPrograms?: number
}

interface MatrixGameStateShape {
  knownNodes: unknown[]
  activeNodeId?: string
  activePrograms: unknown[]
}

/**
 * Retires the old flat `RunnerData.matrix` node in favor of `gameState.matrix`
 * (`MatrixGameState`) — see `docs/features/0014-matrix-interactions.md`. Existing matrix data
 * becomes `knownNodes[0]` (`accessLevel: "public"`, `nodeType: "general"`) and `activeNodeId`;
 * `numberOfPrograms` is dropped since the running-Program count is now derived from
 * `activePrograms`, not hand-typed.
 */
const migration: CharacterMigration<{
  matrix?: OldMatrixNode
  gameState?: { matrix?: MatrixGameStateShape }
}> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      const oldMatrix = draft.matrix
      delete draft.matrix

      draft.gameState ??= {}

      if (!oldMatrix) {
        draft.gameState.matrix ??= { knownNodes: [], activePrograms: [] }
        return
      }

      const nodeId = crypto.randomUUID()
      draft.gameState.matrix = {
        knownNodes: [{
          id: nodeId,
          name: oldMatrix.name ?? "",
          matrix: {
            system: oldMatrix.system ?? 0,
            firewall: oldMatrix.firewall ?? 0,
            response: oldMatrix.response ?? 0,
            signal: oldMatrix.signal ?? 0,
          },
          nodeType: "general",
          accessLevel: "public",
        }],
        activeNodeId: nodeId,
        activePrograms: [],
      }
    })
  },
}

export default migration
