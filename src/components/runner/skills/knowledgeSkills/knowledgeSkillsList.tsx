import { sort } from "fast-sort"
import type { FC } from "react"
import { useState } from "react"

import { SkillListPanel } from "#/components/runner/skills/skillListPanel.tsx"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { selectKnowledgeSkills } from "#/lib/stores/runner/skills/skillsSlice.selectors.ts"

import { KnowledgeSkillsListItem } from "./knowledgeSkillsListItem.tsx"

export const KnowledgeSkillsList: FC = () => {
  const knowledgeSkills = useRunnerStoreSelector(selectKnowledgeSkills)
  const [searchQuery, setSearchQuery] = useState("")

  const visibleSkills = sort([...knowledgeSkills])
    .by([
      { desc: (s) => s.rating },
      { asc: (s) => s.name },
    ])
    .filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <SkillListPanel
      searchPlaceholder="Search knowledge skills…"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      groups={[["Knowledge Skills", visibleSkills]]}
      getKey={(skill) => skill.name}
      renderItem={(skill) => <KnowledgeSkillsListItem skill={skill} />}
      emptyMessage={searchQuery ? "No knowledge skills found" : "No knowledge skills added"}
    />
  )
}
