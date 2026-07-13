import { useSelector } from "@tanstack/react-store"

import * as biologySelectors from "#/stores/runner/biology/biologySlice.selectors.ts"
import * as powersSelectors from "#/stores/runner/powers/powersSlice.selectors.ts"
import { useRunnerStoreContext } from "#/stores/runner/runnerStore.context.ts"
import * as skillsSelectors from "#/stores/runner/skills/skillsSlice.selectors.ts"
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
  const store = useRunnerStoreContext()
  return useSelector(store, selector, { compare })
}

/** @deprecated Use `selectAwakening` from `#/stores/runner/biology/biologySlice.selectors.ts` instead (this is the raw `AwakeningType` key, not the denormalized data — that's `selectAwakeningData`). */
export const selectAwakeningType: RunnerDataSelector<AwakeningType> = biologySelectors.selectAwakening

/** @deprecated Use `selectAwakeningData` from `#/stores/runner/biology/biologySlice.selectors.ts` instead. */
export const selectAwakening: RunnerDataSelector<AwakeningData> = biologySelectors.selectAwakeningData

/** @deprecated Use `selectMetatypeData` from `#/stores/runner/biology/biologySlice.selectors.ts` instead. */
export const selectMetatype: RunnerDataSelector<MetatypeData> = biologySelectors.selectMetatypeData

/** @deprecated Use `selectActiveSkills` from `#/stores/runner/skills/skillsSlice.selectors.ts` instead. */
export const selectActiveSkills: RunnerDataSelector<ActiveSkillData[]> = skillsSelectors.selectActiveSkills

/** @deprecated Use `selectSkillGroups` from `#/stores/runner/skills/skillsSlice.selectors.ts` instead. */
export const selectSkillGroups: RunnerDataSelector<SkillGroupData[]> = skillsSelectors.selectSkillGroups

/** @deprecated Use `selectKnowledgeSkills` from `#/stores/runner/skills/skillsSlice.selectors.ts` instead. */
export const selectKnowledgeSkills: RunnerDataSelector<KnowledgeSkillData[]> = skillsSelectors.selectKnowledgeSkills

/** @deprecated Use `selectLanguageSkills` from `#/stores/runner/skills/skillsSlice.selectors.ts` instead. */
export const selectLanguageSkills: RunnerDataSelector<LanguageSkillData[]> = skillsSelectors.selectLanguageSkills

/** @deprecated Use `selectAllowedActiveSkills` from `#/stores/runner/skills/skillsSlice.selectors.ts` instead. */
export const selectAllowedActiveSkills: RunnerDataSelector<Partial<Record<SkillKey, SkillInfo>>> = skillsSelectors.selectAllowedActiveSkills

/** @deprecated Use `selectPowers` from `#/stores/runner/powers/powersSlice.selectors.ts` instead. */
export const selectRunnerPowers: RunnerDataSelector<PowerData[]> = powersSelectors.selectPowers
