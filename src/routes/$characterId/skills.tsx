import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { AttributesSection } from "#/components/Attributes/attributes-section.tsx"
import { ActiveSkillsList } from "#/components/Skills/active-skills/active-skills-list.tsx"
import { KnowledgeSkillsList } from "#/components/Skills/knowledge-skills/knowledge-skills-list.tsx"
import { LanguageSkillsList } from "#/components/Skills/language-skills/language-skills-list.tsx"

type SkillsTabValue = "active" | "knowledge" | "languages"

export const Route = createFileRoute("/$characterId/skills")({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<SkillsTabValue>("active")

  return (
    <Stack gap={1}>
      <Paper sx={{ padding: 1 }}>
        <AttributesSection showLabels={false} />
      </Paper>

      <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as SkillsTabValue)}>
        <Tab value="active" label="Active" sx={{ flexGrow: 1 }} />
        <Tab value="knowledge" label="Knowledge" sx={{ flexGrow: 1 }} />
        <Tab value="languages" label="Languages" sx={{ flexGrow: 1 }} />
      </Tabs>

      {activeTab === "active" && <ActiveSkillsList />}
      {activeTab === "knowledge" && <KnowledgeSkillsList />}
      {activeTab === "languages" && <LanguageSkillsList />}
    </Stack>
  )
}
