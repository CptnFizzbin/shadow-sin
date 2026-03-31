import type { FC, ReactNode } from "react"

import { isAdept } from "#/components/AdeptPowers/AdeptPowersUtils.ts"
import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { AdeptPowersList } from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersList.tsx"
import { SpellsList } from "#/components/CharacterBuilder/Sections/Resources/Magician/SpellsList.tsx"
import {
  TechnomancerSection,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerSection.tsx"
import { isMagician } from "#/components/Spells/SpellsUtils.ts"
import { isTechnomancer } from "#/components/Technomancer/TechnomancerUtils.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const AwakenedSection: FC = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const sections: ReactNode[] = []

  if (isMagician(awakeningType)) {
    sections.push(<SpellsList key={AwakeningType.Magician} />)
  }

  if (isAdept(awakeningType)) {
    sections.push(<AdeptPowersList key={AwakeningType.Adept} />)
  }

  if (isTechnomancer(awakeningType)) {
    sections.push(<TechnomancerSection key={AwakeningType.Technomancer} />)
  }

  return sections
}
