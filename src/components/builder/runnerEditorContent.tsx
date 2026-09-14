import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { RiMenuLine } from "@remixicon/react"
import type { FC } from "react"
import { useMemo, useState } from "react"

import { AdeptPowersBuilderSection } from "#/components/adeptPowers/builder/adeptPowersBuilderSection.tsx"
import { AttributesBuilderSection } from "#/components/attributes/builder/attributesBuilderSection.tsx"
import { BiologyBuilderSection } from "#/components/biology/builder/biologyBuilderSection.tsx"
import { ContactsBuilderSection } from "#/components/contacts/builder/contactsBuilderSection.tsx"
import { ExportRunnerButton } from "#/components/exportImport/exportRunnerButton.tsx"
import { FinancesBuilderSection } from "#/components/finances/builder/financesBuilderSection.tsx"
import { GearBuilderSection } from "#/components/items/builder/gearBuilderSection.tsx"
import { KarmaBuilderSection } from "#/components/karma/builder/karmaBuilderSection.tsx"
import { SpellsBuilderSection } from "#/components/magician/builder/spellsBuilderSection.tsx"
import { EditorNavDrawer } from "#/components/nav/builder/editorNavDrawer.tsx"
import { EditorPageNav } from "#/components/nav/builder/editorPageNav.tsx"
import type { EditorTabId } from "#/components/nav/builder/editorTabId.ts"
import { editorTabOrder, FINALIZE_TAB_ID, getVisibleTabOrder } from "#/components/nav/builder/editorTabId.ts"
import { EditorTabs } from "#/components/nav/builder/editorTabs.tsx"
import { ProfileBuilderSection } from "#/components/profile/builder/profileBuilderSection.tsx"
import { QualitiesBuilderSection } from "#/components/qualities/builder/qualitiesBuilderSection.tsx"
import { ActiveSkillsBuilderSection } from "#/components/skills/builder/activeSkills/activeSkillsBuilderSection.tsx"
import { KnowledgeSkillsBuilderSection } from "#/components/skills/builder/knowledgeSkills/knowledgeSkillsBuilderSection.tsx"
import {
  ComplexFormsBuilderSection,
} from "#/components/technomancer/builder/complexForms/complexFormsBuilderSection.tsx"
import { SpritesBuilderSection } from "#/components/technomancer/builder/sprites/spritesBuilderSection.tsx"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { useEditorTabNavigation } from "#/hooks/builder/nav/useEditorTabNavigation.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { BuilderImportButton } from "./builderImportButton.tsx"
import { BuilderSectionId } from "./builderSectionId.ts"
import { FinalizeSection } from "./finalizeSection.tsx"

interface RunnerEditorContentProps {
  onCancel: () => void
  onImport: (runner: RunnerData) => void
  onRevert: () => void
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

export const RunnerEditorContent: FC<RunnerEditorContentProps> = ({ onCancel, onImport, onRevert }) => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)

  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)
  const tabOrder = useMemo(() => getVisibleTabOrder(editorTabOrder, awakening), [awakening])

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
          <BuilderImportButton onImport={onImport} />
          <ExportRunnerButton />
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={onRevert}
          >
            Revert
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
  )
}
