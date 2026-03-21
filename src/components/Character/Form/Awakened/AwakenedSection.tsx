import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

import { AdeptSection } from "#/components/Character/Form/Awakened/AdeptSection.tsx"
import { MagicianSection } from "#/components/Character/Form/Awakened/MagicianSection.tsx"
import { TechnomancerSection } from "#/components/Character/Form/Awakened/Technomancer/TechnomancerSection.tsx"
import { useCharacterBuilderStore } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import {
  AwakeningType,
  TechAwakeningTypes,
} from "#/lib/system/types/awakeningType.ts"

export const AwakenedSection: FC = () => {
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)

  let sectionTitle: string
  let sectionContent: ReactNode

  if (TechAwakeningTypes.includes(awakeningType)) {
    sectionTitle = "Technomancer Resources"
    sectionContent = <TechnomancerSection />
  } else if (
    awakeningType === AwakeningType.Magician ||
    awakeningType === AwakeningType.MysticAdept
  ) {
    sectionTitle = "Magic Resources"
    sectionContent = <MagicianSection />
  } else if (awakeningType === AwakeningType.Adept) {
    sectionTitle = "Adept Resources"
    sectionContent = <AdeptSection />
  } else {
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
