import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { ExportCharacterButton } from "#/components/Character/export-character-button.tsx"
import { useBuilderRootStateStore } from "#/components/CharacterBuilder/Hooks/use-builder-root-state-store.ts"
import {
  AttributesBuilderSection,
} from "#/components/CharacterBuilder/Sections/Attributes/attributes-builder-section.tsx"
import { BiologyBuilderSection } from "#/components/CharacterBuilder/Sections/Biology/biology-builder-section.tsx"
import { ContactsBuilderSection } from "#/components/CharacterBuilder/Sections/Contacts/contacts-builder-section.tsx"
import { GearBuilderSection } from "#/components/CharacterBuilder/Sections/Gear/gear-builder-section.tsx"
import { ProfileBuilderSection } from "#/components/CharacterBuilder/Sections/Profile/profile-builder-section.tsx"
import { QualitiesBuilderSection } from "#/components/CharacterBuilder/Sections/Qualities/qualities-builder-section.tsx"
import {
  AdeptPowersBuilderSection,
} from "#/components/CharacterBuilder/Sections/Resources/Adept/adept-powers-builder-section.tsx"
import {
  SpellsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Resources/Magician/spells-builder-section.tsx"
import {
  ComplexFormsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexForms/complex-forms-builder-section.tsx"
import {
  SpritesBuilderSection,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/Sprites/sprites-builder-section.tsx"
import {
  ActiveSkillsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/active-skills-builder-section.tsx"
import {
  KnowledgeSkillsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/knowledge-skills-builder-section.tsx"
import { BpSummaryFooter } from "#/components/CharacterBuilder/Sections/Summary/bp-summary-footer.tsx"
import { CharacterBuilderStoreProvider } from "#/components/CharacterBuilder/character-builder-store-provider.tsx"
import { SaveCharacterButton } from "#/components/CharacterBuilder/save-character-button.tsx"
import { AllBuilderAlerts } from "#/components/UI/alerts/alerts-list.tsx"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"

interface CharacterFormProps {
  character?: CharacterSheet
}

export const CharacterBuilder: FC<CharacterFormProps> = ({ character }) => {
  const [isBpPanelExpanded, setIsBpPanelExpanded] = useState(false)
  const [rootStore, resetRootStore] = useBuilderRootStateStore(character)
  const navigate = useNavigate()

  const handleCancel = () => {
    if (character) {
      navigate({ to: "/$characterId/about", params: { characterId: character.id } })
    } else {
      navigate({ to: "/" })
    }
  }

  return (
    <CharacterBuilderStoreProvider rootStore={rootStore}>
      <Stack gap={1}>
        <Stack
          gap={1}
          sx={{
            opacity: isBpPanelExpanded ? 0.6 : 1,
            transition: "opacity 0.2s ease",
            pointerEvents: isBpPanelExpanded ? "none" : "auto",
          }}
        >
          <Stack direction="row" justifyContent="space-between" gap={1}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Stack direction="row" gap={1}>
              <ExportCharacterButton />
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => resetRootStore()}
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
        <SaveCharacterButton />
      </Stack>
    </CharacterBuilderStoreProvider>
  )
}
