import { Button } from "@mui/material"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
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

  return (
    <CharacterBuilderStoreProvider rootStore={rootStore}>
      <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        <Stack gap={1}>
          <Box
            sx={{
              opacity: isBpPanelExpanded ? 0.6 : 1,
              transition: "opacity 0.2s ease",
              pointerEvents: isBpPanelExpanded ? "none" : "auto",
            }}
          >
            <Stack gap={1}>
              <Stack direction="row" justifyContent="flex-end" gap={1}>
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

              <Grid container spacing={1} alignItems="flex-start">
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Stack gap={1}>
                    <ProfileBuilderSection />
                    <BiologyBuilderSection />
                    <AttributesBuilderSection />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                  <Stack gap={1}>
                    <QualitiesBuilderSection />
                    <SkillsBuilderSection />
                    <AwakenedSection />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                  <Stack gap={1}>
                    <GearBuilderSection />
                    <ContactsBuilderSection />
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Box>

          <BpSummaryFooter onExpandedChange={setIsBpPanelExpanded} />

          <AllBuilderAlerts />
          <SaveCharacterButton />
        </Stack>
      </Box>
    </CharacterBuilderStoreProvider>
  )
}
