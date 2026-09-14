import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { RiMenuLine } from "@remixicon/react"
import type { FC } from "react"
import { useMemo, useState } from "react"

import { ExportRunnerButton } from "#/components/exportImport/exportRunnerButton.tsx"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { useEditorTabNavigation } from "#/hooks/builder/nav/useEditorTabNavigation.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { BuilderImportButton } from "./builderImportButton.tsx"
import { FinalizeSection } from "./finalizeSection.tsx"
import { EditorNavDrawer } from "#/components/nav/builder/editorNavDrawer.tsx"
import { EditorPageNav } from "#/components/nav/builder/editorPageNav.tsx"
import type { EditorTabId } from "#/components/nav/builder/editorTabId.ts"
import { builderTabOrder, FINALIZE_TAB_ID, getVisibleTabOrder } from "#/components/nav/builder/editorTabId.ts"
import { EditorTabs } from "#/components/nav/builder/editorTabs.tsx"
import { AttributesBuilderSection } from "#/components/attributes/builder/attributesBuilderSection.tsx"
import { BiologyBuilderSection } from "#/components/biology/builder/biologyBuilderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { ContactsBuilderSection } from "#/components/contacts/builder/contactsBuilderSection.tsx"
import { GearBuilderSection } from "#/components/items/builder/gearBuilderSection.tsx"
import { ProfileBuilderSection } from "#/components/profile/builder/profileBuilderSection.tsx"
import { QualitiesBuilderSection } from "#/components/qualities/builder/qualitiesBuilderSection.tsx"
import { AdeptPowersBuilderSection } from "#/components/adeptPowers/builder/adeptPowersBuilderSection.tsx"
import { SpellsBuilderSection } from "#/components/magician/builder/spellsBuilderSection.tsx"
import {
  ComplexFormsBuilderSection,
} from "#/components/technomancer/builder/complexForms/complexFormsBuilderSection.tsx"
import { SpritesBuilderSection } from "#/components/technomancer/builder/sprites/spritesBuilderSection.tsx"
import { ActiveSkillsBuilderSection } from "#/components/skills/builder/activeSkills/activeSkillsBuilderSection.tsx"
import { KnowledgeSkillsBuilderSection } from "#/components/skills/builder/knowledgeSkills/knowledgeSkillsBuilderSection.tsx"
import { BpSummaryFooter } from "#/components/summary/bpSummaryFooter.tsx"

interface RunnerBuilderContentProps {
  reset: () => void
  loadRunner: (runner: RunnerData) => void
  onCancel: () => void
}

// Reputation, Karma, and Finances aren't in builderTabOrder (see editorTabId.ts), so they're
// omitted here too — this only needs an entry for every tab the Builder actually navigates to.
const tabComponents: Partial<Record<EditorTabId, FC>> = {
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
  [FINALIZE_TAB_ID]: FinalizeSection,
}

export const RunnerBuilderContent: FC<RunnerBuilderContentProps> = ({ reset, loadRunner, onCancel }) => {
  const [isBpPanelExpanded, setIsBpPanelExpanded] = useState(false)
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)

  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)
  const tabOrder = useMemo(() => getVisibleTabOrder(builderTabOrder, awakening), [awakening])

  const {
    activeTab,
    setActiveTab,
    isFirst,
    isLast,
    nextTab,
    prevTab,
    goToFinalize,
  } = useEditorTabNavigation(tabOrder, BuilderSectionId.profile)

  const ActiveTabComponent = tabComponents[activeTab]

  return (
    <Stack>
      <Stack
        sx={{
          opacity: isBpPanelExpanded ? 0.6 : 1,
          transition: "opacity 0.2s ease",
          pointerEvents: isBpPanelExpanded ? "none" : "auto",
        }}
      >
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={onCancel}
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
              onClick={() => reset()}
            >
              Reset
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EditorTabs value={activeTab} tabOrder={tabOrder} onChange={setActiveTab} />

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
          tabOrder={tabOrder}
          onSelect={setActiveTab}
        />

        <BpSummaryFooter onExpandedChange={setIsBpPanelExpanded} />

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

            {ActiveTabComponent && <ActiveTabComponent />}
          </Stack>
        </SwipeSurface>
      </Stack>
    </Stack>
  )
}
