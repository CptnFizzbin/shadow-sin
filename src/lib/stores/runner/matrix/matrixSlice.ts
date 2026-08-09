import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import {
  setMatrixNodeFirewall,
  setMatrixNodeName,
  setMatrixNodeNumberOfPrograms,
  setMatrixNodeResponse,
  setMatrixNodeSignal,
  setMatrixNodeSystem,
} from "./matrixSlice.actions.ts"

const initialState: RunnerData["matrix"] = {
  name: "",
  system: 0,
  firewall: 0,
  response: 0,
  signal: 0,
  numberOfPrograms: 0,
}

export const matrixReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setMatrixNodeName, (state, action) => {
      state.name = action.payload
    })
    .addCase(setMatrixNodeSystem, (state, action) => {
      state.system = action.payload
    })
    .addCase(setMatrixNodeFirewall, (state, action) => {
      state.firewall = action.payload
    })
    .addCase(setMatrixNodeResponse, (state, action) => {
      state.response = action.payload
    })
    .addCase(setMatrixNodeSignal, (state, action) => {
      state.signal = action.payload
    })
    .addCase(setMatrixNodeNumberOfPrograms, (state, action) => {
      state.numberOfPrograms = action.payload
    })
})
