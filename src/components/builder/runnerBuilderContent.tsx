import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { RiMenuLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useMemo, useState } from "react"

import { AttributesBuilderSection } from "#/components/entities/attributes/builder/attributesBuilderSection.tsx"
import { GearBuilderSection } from "#/components/entities/items/builder/gearBuilderSection.tsx"
import {
  AdeptPowersBuilderSection,
} from "#/components/runner/awakenings/adept/adeptPowers/builder/adeptPowersBuilderSection.tsx"
import { SpellsBuilderSection } from "#/components/runner/awakenings/magician/builder/spellsBuilderSection.tsx"
import {
  ComplexFormsBuilderSection,
} from "#/components/runner/awakenings/technomancer/builder/complexForms/complexFormsBuilderSection.tsx"
import {
  SpritesBuilderSection,
} from "#/components/runner/awakenings/technomancer/builder/sprites/spritesBuilderSection.tsx"
import { BiologyBuilderSection } from "#/components/runner/sections/biology/builder/biologyBuilderSection.tsx"
import { ContactsBuilderSection } from "#/components/runner/sections/contacts/builder/contactsBuilderSection.tsx"
import { ProfileBuilderSection } from "#/components/runner/sections/profile/builder/profileBuilderSection.tsx"
import { QualitiesBuilderSection } from "#/components/runner/sections/qualities/builder/qualitiesBuilderSection.tsx"
import { ActiveSkillsBuilderSection } from "#/components/skills/builder/activeSkills/activeSkillsBuilderSection.tsx"
import {
  KnowledgeSkillsBuilderSection,
} from "#/components/skills/builder/knowledgeSkills/knowledgeSkillsBuilderSection.tsx"
import { ExportRunnerButton } from "#/components/system/exportImport/exportRunnerButton.tsx"
import { EditorNavDrawer } from "#/components/ui/nav/builder/editorNavDrawer.tsx"
import { EditorPageNav } from "#/components/ui/nav/builder/editorPageNav.tsx"
import type { EditorTabId } from "#/components/ui/nav/builder/editorTabId.ts"
import { builderTabOrder, FINALIZE_TAB_ID, getVisibleTabOrder } from "#/components/ui/nav/builder/editorTabId.ts"
import { EditorTabs } from "#/components/ui/nav/builder/editorTabs.tsx"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { useEditorTabNavigation } from "#/hooks/builder/nav/useEditorTabNavigation.ts"
import { BuilderActions } from "#/state/builder/builderStore.actions.ts"
import { useAppDispatch } from "#/state/rootState.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { BuildPointsSummary } from "./buildPoints/summary/buildPointsSummary.tsx"
import { BuilderImportButton } from "./builderImportButton.tsx"
import { BuilderSectionId } from "./builderSectionId.ts"
import { FinalizeSection } from "./finalizeSection.tsx"

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

export const RunnerBuilderContent: FC = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const awakening = useRunnerSelector(BiologySelectors.selectAwakening)
  const tabOrder = useMemo(() => getVisibleTabOrder(builderTabOrder, awakening), [awakening])

  const onCancel = () => {
    navigate({ to: "/" })
  }

  const reset = () => {
    dispatch(BuilderActions.reset())
  }

  const loadRunner = (runner: RunnerData) => {
    dispatch(RunnerActions.load(runner))
  }

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

      <BuildPointsSummary />

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
  )
}
