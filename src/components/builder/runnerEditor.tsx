import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { ExportRunnerButton } from "#/components/runner/exportImport/exportRunnerButton.tsx"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { NumberUtils } from "#/lib/numberUtils.ts"
import { EditModeContext } from "#/stores/builder/editMode.context.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { AllBuilderAlerts } from "./alerts/allBuilderAlerts.tsx"
import { BuilderImportButton } from "./builderImportButton.tsx"
import { BuilderStoreProvider } from "./builderStoreProvider.tsx"
import { useBuilderStores } from "./hooks/useBuilderStores.ts"
import { BuilderTabs } from "./nav/builderTabs.tsx"
import { SaveRunnerButton } from "./saveRunnerButton.tsx"
import { AttributesBuilderSection } from "./sections/attributes/attributesBuilderSection.tsx"
import { BiologyBuilderSection } from "./sections/biology/biologyBuilderSection.tsx"
import { BuilderSectionId, builderSectionOrder } from "./sections/builderSectionId.ts"
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

interface RunnerEditorProps {
  runner: RunnerData
}

const sectionComponents: Record<BuilderSectionId, FC> = {
  [BuilderSectionId.profile]: ProfileBuilderSection,
  [BuilderSectionId.biology]: BiologyBuilderSection,
  [BuilderSectionId.attributes]: AttributesBuilderSection,
  [BuilderSectionId.qualities]: QualitiesBuilderSection,
  [BuilderSectionId.activeSkills]: ActiveSkillsBuilderSection,
  [BuilderSectionId.knowledgeSkills]: KnowledgeSkillsBuilderSection,
  [BuilderSectionId.spells]: SpellsBuilderSection,
  [BuilderSectionId.adeptPowers]: AdeptPowersBuilderSection,
  [BuilderSectionId.complexForms]: ComplexFormsBuilderSection,
  [BuilderSectionId.sprites]: SpritesBuilderSection,
  [BuilderSectionId.gear]: GearBuilderSection,
  [BuilderSectionId.contacts]: ContactsBuilderSection,
}

export const RunnerEditor: FC<RunnerEditorProps> = ({ runner }) => {
  const [activeSection, setActiveSection] = useState<BuilderSectionId>(BuilderSectionId.profile)
  const { runnerStore, builderStore, loadRunner } = useBuilderStores(runner)
  const navigate = useNavigate()

  const currentIndex = builderSectionOrder.indexOf(activeSection)

  const nextSection = () => {
    const nextIndex = NumberUtils.clamp(currentIndex + 1, { max: builderSectionOrder.length - 1 })
    setActiveSection(builderSectionOrder[nextIndex])
  }

  const prevSection = () => {
    const prevIndex = NumberUtils.clamp(currentIndex - 1, { min: 0 })
    setActiveSection(builderSectionOrder[prevIndex])
  }

  const handleCancel = () => {
    navigate({ to: "/$runnerId/about", params: { runnerId: runner.id } })
  }

  const handleRevert = () => {
    runnerStore.setState(() => runner)
  }

  const ActiveSection = sectionComponents[activeSection]

  return (
    <BuilderStoreProvider runnerStore={runnerStore} builderStore={builderStore}>
      <EditModeContext.Provider value={true}>
        <Stack>
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
                onClick={handleRevert}
              >
                Revert
              </Button>
            </Stack>
          </Stack>

          <BuilderTabs value={activeSection} onChange={setActiveSection} />

          <SwipeSurface onSwipeRightToLeft={nextSection} onSwipeLeftToRight={prevSection}>
            <ActiveSection />
          </SwipeSurface>

          <AllBuilderAlerts />
          <SaveRunnerButton requireValid={false} />
        </Stack>
      </EditModeContext.Provider>
    </BuilderStoreProvider>
  )
}
