import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { CharacterBuilderStoreProvider } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { FormPersister } from "#/components/CharacterBuilder/FormPersister.ts"
import { useDefaultValues } from "#/components/CharacterBuilder/Hooks/UseDefaultValues.ts"
import { useRootCharacterBuilderStore } from "#/components/CharacterBuilder/Hooks/UseRootCharacterBuilderStore.ts"
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
import type { PlayerCharacterData } from "#/lib/system/playerCharacterData.ts"

interface CharacterFormProps {
  character?: PlayerCharacterData
}

export const CharacterForm: FC<CharacterFormProps> = ({ character }) => {
  const store = useRootCharacterBuilderStore(character)
  const defaultValues = useDefaultValues({ character })
  const [isBpPanelExpanded, setIsBpPanelExpanded] = useState(false)

  return (
    <CharacterBuilderStoreProvider store={store}>
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
                const characterId = store.state.characterId
                store.setState(() => defaultValues)
                FormPersister.clearState(characterId)
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
