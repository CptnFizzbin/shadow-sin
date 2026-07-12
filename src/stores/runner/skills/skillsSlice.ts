import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import {
  removeActiveSkill,
  removeKnowledgeSkill,
  removeLanguageSkill,
  removeSkillGroup,
  setActiveSkill,
  setKnowledgeSkill,
  setLanguageSkill,
  setSkillGroup,
} from "./skillsSlice.actions.ts"

const initialState: RunnerData["skills"] = {
  activeSkills: [],
  skillGroups: [],
  knowledgeSkills: [],
  languageSkills: [],
}

export const skillsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setActiveSkill, (state, action) => {
      const index = state.activeSkills.findIndex((s) => s.name === action.payload.name)
      if (index === -1) state.activeSkills.push(action.payload)
      else state.activeSkills[index] = action.payload
    })
    .addCase(removeActiveSkill, (state, action) => {
      state.activeSkills = state.activeSkills.filter((s) => s.name !== action.payload)
    })
    .addCase(setSkillGroup, (state, action) => {
      const index = state.skillGroups.findIndex((g) => g.name === action.payload.name)
      if (index === -1) state.skillGroups.push(action.payload)
      else state.skillGroups[index] = action.payload
    })
    .addCase(removeSkillGroup, (state, action) => {
      state.skillGroups = state.skillGroups.filter((g) => g.name !== action.payload)
    })
    .addCase(setKnowledgeSkill, (state, action) => {
      const index = state.knowledgeSkills.findIndex((s) => s.name === action.payload.name)
      if (index === -1) state.knowledgeSkills.push(action.payload)
      else state.knowledgeSkills[index] = action.payload
    })
    .addCase(removeKnowledgeSkill, (state, action) => {
      state.knowledgeSkills = state.knowledgeSkills.filter((s) => s.name !== action.payload)
    })
    .addCase(setLanguageSkill, (state, action) => {
      const index = state.languageSkills.findIndex((s) => s.name === action.payload.name)
      if (index === -1) state.languageSkills.push(action.payload)
      else state.languageSkills[index] = action.payload
    })
    .addCase(removeLanguageSkill, (state, action) => {
      state.languageSkills = state.languageSkills.filter((s) => s.name !== action.payload)
    })
})
