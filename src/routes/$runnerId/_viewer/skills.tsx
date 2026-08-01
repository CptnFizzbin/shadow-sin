import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { ActiveSkillsList } from "#/components/runner/skills/activeSkills/activeSkillsList.tsx"
import { KnowledgeSkillsList } from "#/components/runner/skills/knowledgeSkills/knowledgeSkillsList.tsx"
import { LanguageSkillsList } from "#/components/runner/skills/languageSkills/languageSkillsList.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

type SkillsTabValue = "active" | "knowledge" | "languages"

export const Route = createFileRoute("/$runnerId/_viewer/skills")({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<SkillsTabValue>("active")

  return (
    <Stack>
      <SectionHeader>Skills</SectionHeader>

      <Paper sx={{ margin: -1, marginBottom: 0 }} variant="elevation">
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as SkillsTabValue)}>
          <Tab value="active" label="Active" sx={{ flexGrow: 1 }} />
          <Tab value="knowledge" label="Knowledge" sx={{ flexGrow: 1 }} />
          <Tab value="languages" label="Languages" sx={{ flexGrow: 1 }} />
        </Tabs>
      </Paper>

      {activeTab === "active" && <ActiveSkillsList />}
      {activeTab === "knowledge" && <KnowledgeSkillsList />}
      {activeTab === "languages" && <LanguageSkillsList />}
    </Stack>
  )
}
