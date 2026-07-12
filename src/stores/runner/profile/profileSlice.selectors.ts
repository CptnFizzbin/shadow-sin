import { createSelector } from "reselect"

import { Lifestyles } from "#/system/lifestyleType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectProfile(state: RunnerData): RunnerData["profile"] {
  return state.profile
}

export function selectProfileName(state: RunnerData): string {
  return state.profile.name
}

export function selectProfileAlias(state: RunnerData): string {
  return state.profile.alias
}

export function selectLifestyle(state: RunnerData): RunnerData["profile"]["lifestyle"] {
  return state.profile.lifestyle
}

export const selectLifestyleQuality = createSelector(
  selectLifestyle,
  (lifestyle) => lifestyle?.quality,
)

export const selectLifestyleMonthsPaid = createSelector(
  selectLifestyle,
  (lifestyle) => lifestyle?.monthsPaid,
)

export const selectLifestyleInfo = createSelector(
  selectLifestyleQuality,
  (quality) => quality ? Lifestyles[quality] : undefined,
)
