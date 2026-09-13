import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { RiMenuLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { ExportRunnerButton } from "#/components/runner/exportImport/exportRunnerButton.tsx"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { EditorModeProvider } from "#/contexts/builder/editorMode.tsx"
import { useEditorTabNavigation } from "#/hooks/builder/nav/useEditorTabNavigation.ts"
import { useBuilderStores } from "#/hooks/builder/useBuilderStores.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { BuilderImportButton } from "./builderImportButton.tsx"
import { BuilderStoreProvider } from "./builderStoreProvider.tsx"
import { FinalizeSection } from "./finalizeSection.tsx"
import { EditorNavDrawer } from "./nav/editorNavDrawer.tsx"
import { EditorPageNav } from "./nav/editorPageNav.tsx"
import type { EditorTabId } from "./nav/editorTabId.ts"
import { editorTabOrder, FINALIZE_TAB_ID } from "./nav/editorTabId.ts"
import { EditorTabs } from "./nav/editorTabs.tsx"
import { AttributesBuilderSection } from "./sections/attributes/attributesBuilderSection.tsx"
import { BiologyBuilderSection } from "./sections/biology/biologyBuilderSection.tsx"
import { BuilderSectionId } from "./sections/builderSectionId.ts"
import { ContactsBuilderSection } from "./sections/contacts/contactsBuilderSection.tsx"
import { FinancesBuilderSection } from "./sections/finances/financesBuilderSection.tsx"
import { GearBuilderSection } from "./sections/gear/gearBuilderSection.tsx"
import { KarmaBuilderSection } from "./sections/karma/karmaBuilderSection.tsx"
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

const tabComponents: Record<EditorTabId, FC> = {
  [BuilderSectionId.profile]: ProfileBuilderSection,
  [BuilderSectionId.biology]: BiologyBuilderSection,
  [BuilderSectionId.reputation]: UnderConstruction,
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
  [BuilderSectionId.karma]: KarmaBuilderSection,
  [BuilderSectionId.finances]: FinancesBuilderSection,
  [FINALIZE_TAB_ID]: FinalizeSection,
}

export const RunnerEditor: FC<RunnerEditorProps> = ({ runner }) => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)
  const { runnerStore, builderStore, loadRunner } = useBuilderStores(runner)
  const navigate = useNavigate()

  const {
    activeTab,
    setActiveTab,
    isFirst,
    isLast,
    nextTab,
    prevTab,
    goToFinalize,
  } = useEditorTabNavigation(editorTabOrder, BuilderSectionId.profile)

  const handleCancel = () => {
    navigate({ to: "/$runnerId/about", params: { runnerId: runner.id } })
  }

  const handleRevert = () => {
    runnerStore.setState(() => runner)
  }

  const ActiveTabComponent = tabComponents[activeTab]

  return (
    <BuilderStoreProvider runnerStore={runnerStore} builderStore={builderStore}>
      <EditorModeProvider mode="edit">
        <Stack>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Stack direction="row">
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

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EditorTabs value={activeTab} tabOrder={editorTabOrder} onChange={setActiveTab} />

            <IconButton
              onClick={() => setNavDrawerOpen(true)}
              aria-label="Open page menu"
              sx={{ flexShrink: 0 }}
            >
              <RiMenuLine />
            </IconButton>
          </Box>

          <EditorNavDrawer
            open={navDrawerOpen}
            onClose={() => setNavDrawerOpen(false)}
            value={activeTab}
            tabOrder={editorTabOrder}
            onSelect={setActiveTab}
          />

          <SwipeSurface onSwipeRightToLeft={nextTab} onSwipeLeftToRight={prevTab}>
            <Stack>
              <EditorPageNav
                value={activeTab}
                isFirst={isFirst}
                isLast={isLast}
                onPrev={prevTab}
                onNext={nextTab}
                onFinalize={goToFinalize}
              />

              <ActiveTabComponent />
            </Stack>
          </SwipeSurface>
        </Stack>
      </EditorModeProvider>
    </BuilderStoreProvider>
  )
}
