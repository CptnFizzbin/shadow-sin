import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { AttributesSection } from "#/components/CharacterBuilder/Attributes/AttributesSection.tsx"
import { BiologySection } from "#/components/CharacterBuilder/Biology/BiologySection.tsx"
import { CharacterBuilderStoreProvider } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { ContactsList } from "#/components/CharacterBuilder/Contacts/ContactsList.tsx"
import { FormPersister } from "#/components/CharacterBuilder/FormPersister.ts"
import { GearSection } from "#/components/CharacterBuilder/Gear/GearSection.tsx"
import { ProfileSection } from "#/components/CharacterBuilder/Profile/ProfileSection.tsx"
import { QualitiesSection } from "#/components/CharacterBuilder/Qualities/QualitiesSection.tsx"
import { AwakenedSection } from "#/components/CharacterBuilder/Resources/AwakenedSection.tsx"
import { SkillsFormGroup } from "#/components/CharacterBuilder/Skills/SkillsFormGroup.tsx"
import { BpSummaryFooter } from "#/components/CharacterBuilder/Summary/BpSummaryFooter.tsx"
import { useDefaultValues } from "#/components/CharacterBuilder/UseDefaultValues.ts"
import { useRootCharacterBuilderStore } from "#/components/CharacterBuilder/UseRootCharacterBuilderStore.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

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

          <Paper sx={{ padding: 1 }}>
            <Stack gap={1}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Profile
              </Typography>

              <ProfileSection />
            </Stack>
          </Paper>

          <Paper sx={{ padding: 1 }}>
            <Stack gap={1}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Biology
              </Typography>

              <BiologySection />
            </Stack>
          </Paper>

          <Paper sx={{ padding: 1 }}>
            <Stack gap={1}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Attributes
              </Typography>

              <AttributesSection />
            </Stack>
          </Paper>

          <Paper sx={{ padding: 1 }}>
            <Stack gap={1}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Qualities
              </Typography>

              <QualitiesSection />
            </Stack>
          </Paper>

          <Paper sx={{ padding: 1 }}>
            <Stack gap={1}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Skills
              </Typography>

              <SkillsFormGroup />
            </Stack>
          </Paper>

          <AwakenedSection />

          <Paper sx={{ padding: 1 }}>
            <Stack gap={1}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Gear
              </Typography>

              <GearSection />
            </Stack>
          </Paper>

          <Paper sx={{ padding: 1 }}>
            <Stack gap={1}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Contacts
              </Typography>

              <ContactsList />
            </Stack>
          </Paper>
        </Stack>

        <BpSummaryFooter onExpandedChange={setIsBpPanelExpanded} />
      </Stack>
    </CharacterBuilderStoreProvider>
  )
}
