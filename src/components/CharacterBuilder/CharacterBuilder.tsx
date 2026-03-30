import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { createDefaultCharacterSheet } from "#/components/Character/CreateDefaultCharacterSheet.ts"
import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import { CharacterBuilderStoreProvider } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
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
import { StorePersister, usePersistedStore } from "#/components/CharacterBuilder/StorePersister.ts"
import { AllBuilderAlerts } from "#/components/UI/Alerts/AlertsList.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

interface CharacterFormProps {
  character?: CharacterSheet
}

export const CharacterBuilder: FC<CharacterFormProps> = ({ character }) => {
  const [isBpPanelExpanded, setIsBpPanelExpanded] = useState(false)

  const defaultCharacterValues = character || createDefaultCharacterSheet()
  const defaultBuilderValues: CharacterBuilderState = {
    characterSheet: defaultCharacterValues,
  }

  const storageKey = `builder:${character?.id ?? "new"}`
  const builderStateStore = usePersistedStore(storageKey, defaultBuilderValues)

  return (
    <CharacterBuilderStoreProvider builderStateStore={builderStateStore}>
      <Stack gap={1}>
        <Stack
          gap={1}
          sx={{
            opacity: isBpPanelExpanded ? 0.6 : 1,
            transition: "opacity 0.2s ease",
            pointerEvents: isBpPanelExpanded ? "none" : "auto",
          }}
        >
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => {
                StorePersister.clearState(storageKey)
                builderStateStore.setState(() => defaultBuilderValues)
              }}
            >
              Reset
            </Button>
          </Stack>

          <ProfileBuilderSection />
          <BiologyBuilderSection />
          <AttributesBuilderSection />
          <QualitiesBuilderSection />
          <SkillsBuilderSection />
          <AwakenedSection />
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
