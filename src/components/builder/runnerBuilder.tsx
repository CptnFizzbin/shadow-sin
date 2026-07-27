import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { ExportRunnerButton } from "#/components/runner/exportImport/exportRunnerButton.tsx"
import { EditorModeProvider } from "#/lib/contexts/builder/editorMode.tsx"
import { useBuilderStores } from "#/lib/hooks/builder/useBuilderStores.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { AllBuilderAlerts } from "./alerts/allBuilderAlerts.tsx"
import { BuilderImportButton } from "./builderImportButton.tsx"
import { BuilderStoreProvider } from "./builderStoreProvider.tsx"
import { SaveRunnerButton } from "./saveRunnerButton.tsx"
import { AttributesBuilderSection } from "./sections/attributes/attributesBuilderSection.tsx"
import { BiologyBuilderSection } from "./sections/biology/biologyBuilderSection.tsx"
import { ContactsBuilderSection } from "./sections/contacts/contactsBuilderSection.tsx"
import { GearBuilderSection } from "./sections/gear/gearBuilderSection.tsx"
import { ProfileBuilderSection } from "./sections/profile/profileBuilderSection.tsx"
import { QualitiesBuilderSection } from "./sections/qualities/qualitiesBuilderSection.tsx"
import { AdeptPowersBuilderSection } from "./sections/resources/adept/adeptPowersBuilderSection.tsx"
import { SpellsBuilderSection } from "./sections/resources/magician/spellsBuilderSection.tsx"
import {
  ComplexFormsBuilderSection,
} from "./sections/resources/technomancer/complexForms/complexFormsBuilderSection.tsx"
import { SpritesBuilderSection } from "./sections/resources/technomancer/sprites/spritesBuilderSection.tsx"
import { ActiveSkillsBuilderSection } from "./sections/skills/activeSkills/activeSkillsBuilderSection.tsx"
import { KnowledgeSkillsBuilderSection } from "./sections/skills/knowledgeSkills/knowledgeSkillsBuilderSection.tsx"
import { BpSummaryFooter } from "./sections/summary/bpSummaryFooter.tsx"

interface RunnerFormProps {
  runner?: RunnerData
}

export const RunnerBuilder: FC<RunnerFormProps> = ({ runner }) => {
  const [isBpPanelExpanded, setIsBpPanelExpanded] = useState(false)
  const { runnerStore, builderStore, reset, loadRunner } = useBuilderStores(runner)
  const navigate = useNavigate()

  const handleCancel = () => {
    if (runner) {
      navigate({ to: "/$runnerId/about", params: { runnerId: runner.id } })
    } else {
      navigate({ to: "/" })
    }
  }

  return (
    <BuilderStoreProvider runnerStore={runnerStore} builderStore={builderStore}>
      <EditorModeProvider mode="builder">
        <Stack>
          <Stack
            sx={{
              opacity: isBpPanelExpanded ? 0.6 : 1,
              transition: "opacity 0.2s ease",
              pointerEvents: isBpPanelExpanded ? "none" : "auto",
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Stack direction="row" sx={{ gap: 1 }}>
                <BuilderImportButton onImport={loadRunner} />
                <ExportRunnerButton />
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>

            <ProfileBuilderSection />
            <BiologyBuilderSection />
            <AttributesBuilderSection />
            <QualitiesBuilderSection />
            <ActiveSkillsBuilderSection />
            <KnowledgeSkillsBuilderSection />
            <AdeptPowersBuilderSection />
            <SpellsBuilderSection />
            <ComplexFormsBuilderSection />
            <SpritesBuilderSection />
            <GearBuilderSection />
            <ContactsBuilderSection />
          </Stack>

          <BpSummaryFooter onExpandedChange={setIsBpPanelExpanded} />

          <AllBuilderAlerts />
          <SaveRunnerButton />
        </Stack>
      </EditorModeProvider>
    </BuilderStoreProvider>
  )
}
