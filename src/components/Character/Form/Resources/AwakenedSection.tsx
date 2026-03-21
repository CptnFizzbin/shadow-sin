import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

import { useCharacterBuilderStore } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { AdeptSection } from "#/components/Character/Form/Resources/Adept/AdeptSection.tsx"
import { MagicianSection } from "#/components/Character/Form/Resources/Magician/MagicianSection.tsx"
import { TechnomancerSection } from "#/components/Character/Form/Resources/Technomancer/TechnomancerSection.tsx"
import { AwakeningType } from "#/lib/system/types/awakeningType.ts"

export const AwakenedSection: FC = () => {
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)

  let sectionTitle: string
  let sectionContent: ReactNode

  switch (awakeningType) {
    case AwakeningType.Technomancer:
      sectionTitle = "Technomancer Resources"
      sectionContent = <TechnomancerSection />
      break
    case AwakeningType.Magician:
    case AwakeningType.MysticAdept:
      sectionTitle = "Magic Resources"
      sectionContent = <MagicianSection />
      break
    case AwakeningType.Adept:
      sectionTitle = "Adept Resources"
      sectionContent = <AdeptSection />
      break
    default:
      return null
  }

  return (
    <Paper sx={{ padding: 1 }}>
      <Stack gap={1}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {sectionTitle}
        </Typography>
        {sectionContent}
      </Stack>
    </Paper>
  )
}
