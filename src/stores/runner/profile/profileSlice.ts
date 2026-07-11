import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { LifestyleType } from "#/system/lifestyleType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

const initialState: RunnerData["profile"] = {
  alias: "",
  name: "",
  streetCred: 0,
  notoriety: 0,
}

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
    setAlias: (state, action: PayloadAction<string>) => {
      state.alias = action.payload
    },
    setArchetype: (state, action: PayloadAction<string | undefined>) => {
      state.archetype = action.payload
    },
    setDescription: (state, action: PayloadAction<string | undefined>) => {
      state.description = action.payload
    },
    setPersonality: (state, action: PayloadAction<string | undefined>) => {
      state.personality = action.payload
    },
    setPublicAwarenessModifier: (state, action: PayloadAction<number | undefined>) => {
      state.publicAwarenessModifier = action.payload
    },
    setLifestyleQuality: (state, action: PayloadAction<LifestyleType>) => {
      state.lifestyle = { ...(state.lifestyle ?? { quality: action.payload, monthsPaid: 1 }), quality: action.payload }
    },
    setLifestyleMonthsPaid: (state, action: PayloadAction<number>) => {
      state.lifestyle = {
        ...(state.lifestyle ?? { quality: LifestyleType.Street, monthsPaid: action.payload }),
        monthsPaid: action.payload,
      }
    },
  },
})

export const {
  setName: setProfileName,
  setAlias: setProfileAlias,
  setArchetype: setProfileArchetype,
  setDescription: setProfileDescription,
  setPersonality: setProfilePersonality,
  setPublicAwarenessModifier: setProfilePublicAwarenessModifier,
  setLifestyleQuality,
  setLifestyleMonthsPaid,
} = profileSlice.actions
