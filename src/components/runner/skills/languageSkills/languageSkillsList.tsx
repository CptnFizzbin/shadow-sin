import { sort } from "fast-sort"
import type { FC } from "react"
import { useState } from "react"

import { SkillListPanel } from "#/components/runner/skills/skillListPanel.tsx"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"

import { LanguageSkillListItem } from "./languageSkillsListItem.tsx"

export const LanguageSkillsList: FC = () => {
  const languageSkills = useRunnerSelector(SkillsSelectors.selectLanguageSkills)
  const [searchQuery, setSearchQuery] = useState("")

  const visibleSkills = sort(languageSkills)
    .by([
      { desc: (s) => s.rating === "native" },
      { asc: (s) => s.name },
    ])
    .filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <SkillListPanel
      searchPlaceholder="Search languages…"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      groups={[["Languages", visibleSkills]]}
      getKey={(skill) => skill.name}
      renderItem={(skill) => <LanguageSkillListItem skill={skill} />}
      emptyMessage={searchQuery ? "No languages found" : "No language skills added"}
    />
  )
}
