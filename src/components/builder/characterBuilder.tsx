import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { AllBuilderAlerts } from "#/components/builder/alerts/allBuilderAlerts.tsx"
import { CharacterBuilderStoreProvider } from "#/components/builder/characterBuilderStoreProvider.tsx"
import { useBuilderRootStateStore } from "#/components/builder/hooks/useBuilderRootStateStore.ts"
import { ImportYamlBuilderButton } from "#/components/builder/importYamlBuilderButton.tsx"
import { SaveCharacterButton } from "#/components/builder/saveCharacterButton.tsx"
import {
  AttributesBuilderSection,
} from "#/components/builder/sections/attributes/attributesBuilderSection.tsx"
import { BiologyBuilderSection } from "#/components/builder/sections/biology/biologyBuilderSection.tsx"
import { ContactsBuilderSection } from "#/components/builder/sections/contacts/contactsBuilderSection.tsx"
import { GearBuilderSection } from "#/components/builder/sections/gear/gearBuilderSection.tsx"
import { ProfileBuilderSection } from "#/components/builder/sections/profile/profileBuilderSection.tsx"
import { QualitiesBuilderSection } from "#/components/builder/sections/qualities/qualitiesBuilderSection.tsx"
import {
  AdeptPowersBuilderSection,
} from "#/components/builder/sections/resources/adept/adeptPowersBuilderSection.tsx"
import {
  SpellsBuilderSection,
} from "#/components/builder/sections/resources/magician/spellsBuilderSection.tsx"
import {
  ComplexFormsBuilderSection,
} from "#/components/builder/sections/resources/technomancer/complexForms/complexFormsBuilderSection.tsx"
import {
  SpritesBuilderSection,
} from "#/components/builder/sections/resources/technomancer/sprites/spritesBuilderSection.tsx"
import {
  ActiveSkillsBuilderSection,
} from "#/components/builder/sections/skills/activeSkills/activeSkillsBuilderSection.tsx"
import {
  KnowledgeSkillsBuilderSection,
} from "#/components/builder/sections/skills/knowledgeSkills/knowledgeSkillsBuilderSection.tsx"
import { BpSummaryFooter } from "#/components/builder/sections/summary/bpSummaryFooter.tsx"
import { ExportCharacterButton } from "#/components/character/exportImport/exportCharacterButton.tsx"
import type { CharacterSheet } from "#/system/characterSheet.ts"

interface CharacterFormProps {
  character?: CharacterSheet
}

export const CharacterBuilder: FC<CharacterFormProps> = ({ character }) => {
  const [isBpPanelExpanded, setIsBpPanelExpanded] = useState(false)
  const [rootStore, resetRootStore, loadCharacter] = useBuilderRootStateStore(character)
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
              <ImportYamlBuilderButton onImport={loadCharacter} />
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
