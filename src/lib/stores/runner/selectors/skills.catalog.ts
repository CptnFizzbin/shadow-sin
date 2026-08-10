import { selectNativeLanguageSkill } from "#/lib/stores/runner/skills/skillsSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function buildSkillsCatalog(state: RunnerData) {
  return {
    nativeLanguage: selectNativeLanguageSkill(state),
  }
}
