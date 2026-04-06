import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { ExportCharacterButton } from "#/components/character/exportCharacterButton.tsx"
import { CharacterBuilderStoreProvider } from "#/components/characterBuilder/characterBuilderStoreProvider.tsx"
import { useBuilderRootStateStore } from "#/components/characterBuilder/hooks/useBuilderRootStateStore.ts"
import { SaveCharacterButton } from "#/components/characterBuilder/saveCharacterButton.tsx"
import {
  AttributesBuilderSection,
} from "#/components/characterBuilder/sections/attributes/attributesBuilderSection.tsx"
import { BiologyBuilderSection } from "#/components/characterBuilder/sections/biology/biologyBuilderSection.tsx"
import { ContactsBuilderSection } from "#/components/characterBuilder/sections/contacts/contactsBuilderSection.tsx"
import { GearBuilderSection } from "#/components/characterBuilder/sections/gear/gearBuilderSection.tsx"
import { ProfileBuilderSection } from "#/components/characterBuilder/sections/profile/profileBuilderSection.tsx"
import { QualitiesBuilderSection } from "#/components/characterBuilder/sections/qualities/qualitiesBuilderSection.tsx"
import {
  AdeptPowersBuilderSection,
} from "#/components/characterBuilder/sections/resources/adept/adeptPowersBuilderSection.tsx"
import {
  SpellsBuilderSection,
} from "#/components/characterBuilder/sections/resources/magician/spellsBuilderSection.tsx"
import {
  ComplexFormsBuilderSection,
} from "#/components/characterBuilder/sections/resources/technomancer/complexForms/complexFormsBuilderSection.tsx"
import {
  SpritesBuilderSection,
} from "#/components/characterBuilder/sections/resources/technomancer/sprites/spritesBuilderSection.tsx"
import {
  ActiveSkillsBuilderSection,
} from "#/components/characterBuilder/sections/skills/activeSkills/activeSkillsBuilderSection.tsx"
import {
  KnowledgeSkillsBuilderSection,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/knowledgeSkillsBuilderSection.tsx"
import { BpSummaryFooter } from "#/components/characterBuilder/sections/summary/bpSummaryFooter.tsx"
import { AllBuilderAlerts } from "#/components/ui/alerts/alertsList.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

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
