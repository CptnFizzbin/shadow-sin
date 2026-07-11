import { useSelector } from "@tanstack/react-store"

import * as selectors from "#/stores/runner/runnerStore.selectors.ts"
import type { AwakeningData, AwakeningType } from "#/system/awakeningType.ts"
import type { MetatypeData } from "#/system/metatypeData.ts"
import type { PowerData } from "#/system/powers/powerData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"
import type { SkillInfo } from "#/system/skills/skillInfo.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { useRunnerDataContext } from "./runnerDataContext.ts"

export type RunnerDataSelector<TData> = (state: RunnerData) => TData

/**
 * @deprecated Use `useRunnerStoreSelector` from `#/stores/runner/runnerStore.selectors.ts`
 * instead. Not a direct alias: that hook currently reads from a separate, not-yet-wired-up
 * `RunnerStoreContext` (`#/stores/runner/runnerStore.context.ts`) rather than the
 * `RunnerDataContext` actually provided by `RunnerDataProvider` — aliasing straight to it would
 * throw at every call site until that context is unified with this one.
 */
export function useRunnerDataSelector<T>(
  selector: RunnerDataSelector<T>,
  compare?: (prev: T, next: T) => boolean,
) {
  const store = useRunnerDataContext()
  return useSelector(store, selector, { compare })
}

/** @deprecated Use `selectAwakeningType` from `#/stores/runner/runnerStore.selectors.ts` instead. */
export const selectAwakeningType: RunnerDataSelector<AwakeningType> = selectors.selectAwakeningType

/** @deprecated Use `selectAwakening` from `#/stores/runner/runnerStore.selectors.ts` instead. */
export const selectAwakening: RunnerDataSelector<AwakeningData> = selectors.selectAwakening

/** @deprecated Use `selectMetatype` from `#/stores/runner/runnerStore.selectors.ts` instead. */
export const selectMetatype: RunnerDataSelector<MetatypeData> = selectors.selectMetatype

/** @deprecated Use `selectActiveSkills` from `#/stores/runner/runnerStore.selectors.ts` instead. */
export const selectActiveSkills: RunnerDataSelector<ActiveSkillData[]> = selectors.selectActiveSkills

/** @deprecated Use `selectSkillGroups` from `#/stores/runner/runnerStore.selectors.ts` instead. */
export const selectSkillGroups: RunnerDataSelector<SkillGroupData[]> = selectors.selectSkillGroups

/** @deprecated Use `selectKnowledgeSkills` from `#/stores/runner/runnerStore.selectors.ts` instead. */
export const selectKnowledgeSkills: RunnerDataSelector<KnowledgeSkillData[]> = selectors.selectKnowledgeSkills

/** @deprecated Use `selectLanguageSkills` from `#/stores/runner/runnerStore.selectors.ts` instead. */
export const selectLanguageSkills: RunnerDataSelector<LanguageSkillData[]> = selectors.selectLanguageSkills

/** @deprecated Use `selectAllowedActiveSkills` from `#/stores/runner/runnerStore.selectors.ts` instead. */
export const selectAllowedActiveSkills: RunnerDataSelector<Partial<Record<SkillKey, SkillInfo>>> = selectors.selectAllowedActiveSkills

/** @deprecated Use `selectRunnerPowers` from `#/stores/runner/runnerStore.selectors.ts` instead. */
export const selectRunnerPowers: RunnerDataSelector<PowerData[]> = selectors.selectRunnerPowers
