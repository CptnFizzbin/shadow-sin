import { createReducer } from "@reduxjs/toolkit"

import { LifestyleType } from "#/system/model/finances/lifestyleType.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import {
  setLifestyleMonthsPaid,
  setLifestyleQuality,
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
  lifestyle: null,
}

export const profileReducer = createReducer(initialState, (builder) => {
  builder
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
    .addCase(setLifestyleQuality, (state, action) => {
      state.lifestyle = { ...(state.lifestyle ?? { quality: action.payload, monthsPaid: 1 }), quality: action.payload }
    })
    .addCase(setLifestyleMonthsPaid, (state, action) => {
      state.lifestyle = {
        ...(state.lifestyle ?? { quality: LifestyleType.Street, monthsPaid: action.payload }),
        monthsPaid: action.payload,
      }
    })
})
