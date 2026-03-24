import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { AttributesSection } from "#/components/Character/Form/Attributes/AttributesSection.tsx"
import { BiologySection } from "#/components/Character/Form/Biology/BiologySection.tsx"
import { BpSummaryFooter } from "#/components/Character/Form/BpSummaryFooter.tsx"
import { CharacterBuilderStoreProvider } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { ContactsList } from "#/components/Character/Form/Contacts/ContactsList.tsx"
import { FormPersister } from "#/components/Character/Form/FormPersister.ts"
import { GearSection } from "#/components/Character/Form/Gear/GearSection.tsx"
import { ProfileSection } from "#/components/Character/Form/Profile/ProfileSection.tsx"
import { QualitiesSection } from "#/components/Character/Form/Qualities/QualitiesSection.tsx"
import { AwakenedSection } from "#/components/Character/Form/Resources/AwakenedSection.tsx"
import { SkillsFormGroup } from "#/components/Character/Form/Skills/SkillsFormGroup.tsx"
import { useDefaultValues } from "#/components/Character/Form/UseDefaultValues.ts"
import { useRootCharacterBuilderStore } from "#/components/Character/Form/UseRootCharacterBuilderStore.ts"
import { BuilderStoreProvider } from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
import type { CharacterSheet } from "#/lib/system/types/playerCharacterData.ts"

interface CharacterFormProps {
  character?: CharacterSheet
}

export const CharacterForm: FC<CharacterFormProps> = ({ character }) => {
  const { characterStore, builderStore } =
    useRootCharacterBuilderStore(character)
  const { characterFormState: defaultValues } = useDefaultValues({ character })
  const [isBpPanelExpanded, setIsBpPanelExpanded] = useState(false)

  return (
    <CharacterBuilderStoreProvider store={characterStore}>
      <BuilderStoreProvider store={builderStore}>
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
                  const characterId = characterStore.state.characterId
                  characterStore.setState(() => defaultValues)
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
      </BuilderStoreProvider>
    </CharacterBuilderStoreProvider>
  )
}
