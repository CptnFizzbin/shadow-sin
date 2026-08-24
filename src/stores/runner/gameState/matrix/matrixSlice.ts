import { createReducer } from "@reduxjs/toolkit"

import type { MatrixGameState } from "#/system/matrix/matrixGameState.ts"

import {
  addKnownNode,
  clearActiveNode,
  removeKnownNode,
  setActiveNode,
  startActiveProgram,
  stopActiveProgram,
  updateKnownNode,
} from "./matrixSlice.actions.ts"

const initialState: MatrixGameState = {
  knownNodes: [],
  activePrograms: [],
}

export const matrixReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addKnownNode, (state, action) => {
      state.knownNodes.push(action.payload)
    })
    .addCase(updateKnownNode, (state, action) => {
      const index = state.knownNodes.findIndex((node) => node.id === action.payload.id)
      if (index >= 0) state.knownNodes[index] = action.payload
    })
    .addCase(removeKnownNode, (state, action) => {
      const nodeId = action.payload
      state.knownNodes = state.knownNodes.filter((node) => node.id !== nodeId)
      // Cascade: an ActiveProgram referencing the deleted node would otherwise dangle (#440).
      state.activePrograms = state.activePrograms.filter((program) => program.nodeId !== nodeId)
      if (state.activeNodeId === nodeId) delete state.activeNodeId
    })
    .addCase(setActiveNode, (state, action) => {
      state.activeNodeId = action.payload
    })
    .addCase(clearActiveNode, (state) => {
      delete state.activeNodeId
    })
    .addCase(startActiveProgram, (state, action) => {
      const { sourceId, nodeId } = action.payload
      const alreadyRunning = state.activePrograms.some(
        (program) => program.sourceId === sourceId && program.nodeId === nodeId,
      )
      if (!alreadyRunning) state.activePrograms.push(action.payload)
    })
    .addCase(stopActiveProgram, (state, action) => {
      const { sourceId, nodeId } = action.payload
      state.activePrograms = state.activePrograms.filter(
        (program) => !(program.sourceId === sourceId && program.nodeId === nodeId),
      )
    })
})
