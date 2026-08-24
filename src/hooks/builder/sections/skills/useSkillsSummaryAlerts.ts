import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectSkillsSummaryAlerts: Selector<{ runner: RunnerData }, AlertInfo[]> = createMemoizedSelector(
  SkillsSelectors.selectActiveSkills,
  SkillsSelectors.selectKnowledgeSkills,
  SkillsSelectors.selectLanguageSkills,
  (active, knowledge, language): AlertInfo[] => {
    if (active.length === 0 && knowledge.length === 0 && language.length === 0) {
      return [{
        section: "Skills",
        severity: "warning",
        title: "No skills selected",
        message: "No skills have been added. Consider purchasing active, knowledge, or language skills.",
        summaryOnly: true,
      }]
    }

    return []
  },
)
