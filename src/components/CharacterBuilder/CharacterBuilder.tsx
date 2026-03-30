import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { CharacterBuilderStoreProvider } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { ExportCharacterButton } from "#/components/CharacterBuilder/ExportCharacterButton.tsx"
import { useBuilderRootStateStore } from "#/components/CharacterBuilder/Hooks/UseBuilderRootStateStore.ts"
import { SaveCharacterButton } from "#/components/CharacterBuilder/SaveCharacterButton.tsx"
import {
  AttributesBuilderSection,
} from "#/components/CharacterBuilder/Sections/Attributes/AttributesBuilderSection.tsx"
import { BiologyBuilderSection } from "#/components/CharacterBuilder/Sections/Biology/BiologyBuilderSection.tsx"
import { ContactsBuilderSection } from "#/components/CharacterBuilder/Sections/Contacts/ContactsBuilderSection.tsx"
import { GearBuilderSection } from "#/components/CharacterBuilder/Sections/Gear/GearBuilderSection.tsx"
import { ProfileBuilderSection } from "#/components/CharacterBuilder/Sections/Profile/ProfileBuilderSection.tsx"
import { QualitiesBuilderSection } from "#/components/CharacterBuilder/Sections/Qualities/QualitiesBuilderSection.tsx"
import { AwakenedSection } from "#/components/CharacterBuilder/Sections/Resources/AwakenedSection.tsx"
import { SkillsBuilderSection } from "#/components/CharacterBuilder/Sections/Skills/SkillsBuilderSection.tsx"
import { BpSummaryFooter } from "#/components/CharacterBuilder/Sections/Summary/BpSummaryFooter.tsx"
import { AllBuilderAlerts } from "#/components/UI/Alerts/AlertsList.tsx"
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

          <div id="builder-section-profile" tabIndex={-1}>
            <ProfileBuilderSection />
          </div>
          <div id="builder-section-biology" tabIndex={-1}>
            <BiologyBuilderSection />
          </div>
          <div id="builder-section-attributes" tabIndex={-1}>
            <AttributesBuilderSection />
          </div>
          <div id="builder-section-qualities" tabIndex={-1}>
            <QualitiesBuilderSection />
          </div>
          <div id="builder-section-skills" tabIndex={-1}>
            <SkillsBuilderSection />
          </div>
          <div id="builder-section-awakened" tabIndex={-1}>
            <AwakenedSection />
          </div>
          <div id="builder-section-gear" tabIndex={-1}>
            <GearBuilderSection />
          </div>
          <div id="builder-section-contacts" tabIndex={-1}>
            <ContactsBuilderSection />
          </div>
        </Stack>

        <BpSummaryFooter onExpandedChange={setIsBpPanelExpanded} />

        <AllBuilderAlerts />
        <SaveCharacterButton />
      </Stack>
    </CharacterBuilderStoreProvider>
  )
}
