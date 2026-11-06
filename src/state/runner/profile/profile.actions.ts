import { createAction } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/model/runnerData.ts"

export const setProfileName = createAction<string>("profile/setName")
export const setProfileAlias = createAction<string>("profile/setAlias")
export const setProfileArchetype = createAction<string | null>("profile/setArchetype")
export const setProfileDescription = createAction<string | null>("profile/setDescription")
export const setProfilePersonality = createAction<string | null>("profile/setPersonality")

export const ProfileActions = {
  setProfileName,
  setProfileAlias,
  setProfileArchetype,
  setProfileDescription,
  setProfilePersonality,

  patch: createAction<Partial<RunnerData["profile"]>>("runner.profile/patch"),
}
