import { createAction } from "@reduxjs/toolkit"

import type { ActiveProgram } from "#/data/matrix/activeProgram.ts"
import type { KnownNode } from "#/data/matrix/knownNode.ts"

export const addKnownNode = createAction("gameState/matrix/addKnownNode", (node: KnownNode) => {
  return { payload: { ...node, id: crypto.randomUUID() } }
})

export const updateKnownNode = createAction<KnownNode>("gameState/matrix/updateKnownNode")
export const removeKnownNode = createAction<string>("gameState/matrix/removeKnownNode")

export const setActiveNode = createAction<string>("gameState/matrix/setActiveNode")
export const clearActiveNode = createAction("gameState/matrix/clearActiveNode")

export const startActiveProgram = createAction<ActiveProgram>("gameState/matrix/startActiveProgram")
export const stopActiveProgram = createAction<ActiveProgram>("gameState/matrix/stopActiveProgram")
