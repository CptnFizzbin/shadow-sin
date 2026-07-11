import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"

const initialState: RunnerData["skills"] = {
  activeSkills: [],
  skillGroups: [],
  knowledgeSkills: [],
  languageSkills: [],
}

export const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    setActiveSkill: (state, action: PayloadAction<ActiveSkillData>) => {
      const index = state.activeSkills.findIndex((s) => s.name === action.payload.name)
      if (index === -1) state.activeSkills.push(action.payload)
      else state.activeSkills[index] = action.payload
    },
    removeActiveSkill: (state, action: PayloadAction<string>) => {
      state.activeSkills = state.activeSkills.filter((s) => s.name !== action.payload)
    },
    setSkillGroup: (state, action: PayloadAction<SkillGroupData>) => {
      const index = state.skillGroups.findIndex((g) => g.name === action.payload.name)
      if (index === -1) state.skillGroups.push(action.payload)
      else state.skillGroups[index] = action.payload
    },
    removeSkillGroup: (state, action: PayloadAction<string>) => {
      state.skillGroups = state.skillGroups.filter((g) => g.name !== action.payload)
    },
    setKnowledgeSkill: (state, action: PayloadAction<KnowledgeSkillData>) => {
      const index = state.knowledgeSkills.findIndex((s) => s.name === action.payload.name)
      if (index === -1) state.knowledgeSkills.push(action.payload)
      else state.knowledgeSkills[index] = action.payload
    },
    removeKnowledgeSkill: (state, action: PayloadAction<string>) => {
      state.knowledgeSkills = state.knowledgeSkills.filter((s) => s.name !== action.payload)
    },
    setLanguageSkill: (state, action: PayloadAction<LanguageSkillData>) => {
      const index = state.languageSkills.findIndex((s) => s.name === action.payload.name)
      if (index === -1) state.languageSkills.push(action.payload)
      else state.languageSkills[index] = action.payload
    },
    removeLanguageSkill: (state, action: PayloadAction<string>) => {
      state.languageSkills = state.languageSkills.filter((s) => s.name !== action.payload)
    },
  },
})

export const {
  setActiveSkill,
  removeActiveSkill,
  setSkillGroup,
  removeSkillGroup,
  setKnowledgeSkill,
  removeKnowledgeSkill,
  setLanguageSkill,
  removeLanguageSkill,
} = skillsSlice.actions
