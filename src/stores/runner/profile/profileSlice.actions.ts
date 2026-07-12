import { createAction } from "@reduxjs/toolkit"

import type { LifestyleType } from "#/system/lifestyleType.ts"

export const setProfileName = createAction<string>("profile/setName")
export const setProfileAlias = createAction<string>("profile/setAlias")
export const setProfileArchetype = createAction<string | null>("profile/setArchetype")
export const setProfileDescription = createAction<string | null>("profile/setDescription")
export const setProfilePersonality = createAction<string | null>("profile/setPersonality")
export const setProfilePublicAwarenessModifier = createAction<number | undefined>("profile/setPublicAwarenessModifier")
export const setLifestyleQuality = createAction<LifestyleType>("profile/setLifestyleQuality")
export const setLifestyleMonthsPaid = createAction<number>("profile/setLifestyleMonthsPaid")
