import { Button } from "@mui/material"
import Grid from "@mui/material/Grid"
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
import {
  ActiveSkillsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/ActiveSkillsBuilderSection.tsx"
import {
  KnowledgeSkillsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/KnowledgeSkillsBuilderSection.tsx"
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

        <Grid container columns={{ xs: 1, md: 2, lg: 3 }} spacing={1}>
          <Grid size={{ xs: 1, md: 2, lg: 3 }}>
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
          </Grid>

          <Grid size={{ xs: 1, md: 2, lg: 3 }}>
            <ProfileBuilderSection />
          </Grid>

          <Grid size={1}>
            <BiologyBuilderSection />
          </Grid>

          <Grid size={{ xs: 1, md: 2, lg: 3 }}>
            <AttributesBuilderSection />
          </Grid>

          <Grid size={1}>
            <QualitiesBuilderSection />
          </Grid>

          <Grid container>
            <Grid size={1}>
              <ActiveSkillsBuilderSection />
            </Grid>

            <Grid size={1}>
              <KnowledgeSkillsBuilderSection />
            </Grid>
          </Grid>

          <Grid size={1}>
            <AwakenedSection />
          </Grid>

          <Grid size={1}>
            <GearBuilderSection />
          </Grid>
          <Grid size={1}>
            <ContactsBuilderSection />
          </Grid>
        </Grid>

        <BpSummaryFooter onExpandedChange={setIsBpPanelExpanded} />

        <AllBuilderAlerts />
        <SaveCharacterButton />
      </Stack>
    </CharacterBuilderStoreProvider>
  )
}
