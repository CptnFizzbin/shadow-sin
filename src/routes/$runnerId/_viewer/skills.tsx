import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { ActiveSkillsList } from "#/components/skills/viewer/activeSkills/activeSkillsList.tsx"
import { KnowledgeSkillsList } from "#/components/skills/viewer/knowledgeSkills/knowledgeSkillsList.tsx"
import { LanguageSkillsList } from "#/components/skills/viewer/languageSkills/languageSkillsList.tsx"
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
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as SkillsTabValue)} variant="fullWidth">
          <Tab value="active" label="Active" />
          <Tab value="knowledge" label="Knowledge" />
          <Tab value="languages" label="Languages" />
        </Tabs>
      </Paper>

      {activeTab === "active" && <ActiveSkillsList />}
      {activeTab === "knowledge" && <KnowledgeSkillsList />}
      {activeTab === "languages" && <LanguageSkillsList />}
    </Stack>
  )
}
