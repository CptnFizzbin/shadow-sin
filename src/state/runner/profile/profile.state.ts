import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/model/runnerData.ts"

import {
  ProfileActions,
  setProfileAlias,
  setProfileArchetype,
  setProfileDescription,
  setProfileName,
  setProfilePersonality,
} from "./profile.actions.ts"

const initialState: RunnerData["profile"] = {
  alias: "",
  name: "",
  archetype: null,
  description: null,
  personality: null,
}

export const profileReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ProfileActions.patch, (state, action) => {
      Object.assign(state, action.payload)
    })
    .addCase(setProfileName, (state, action) => {
      state.name = action.payload
    })
    .addCase(setProfileAlias, (state, action) => {
      state.alias = action.payload
    })
    .addCase(setProfileArchetype, (state, action) => {
      state.archetype = action.payload
    })
    .addCase(setProfileDescription, (state, action) => {
      state.description = action.payload
    })
    .addCase(setProfilePersonality, (state, action) => {
      state.personality = action.payload
    })
})
