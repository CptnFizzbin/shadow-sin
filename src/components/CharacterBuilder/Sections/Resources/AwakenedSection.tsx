import type { FC, ReactNode } from "react"

import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { AdeptPowersList } from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersList.tsx"
import { isAdept } from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersUtils.ts"
import { SpellsList } from "#/components/CharacterBuilder/Sections/Resources/Magician/SpellsList.tsx"
import { isMagician } from "#/components/CharacterBuilder/Sections/Resources/Magician/SpellsUtils.ts"
import {
  TechnomancerSection,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerSection.tsx"
import { isTechnomancer } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerUtils.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

export const AwakenedSection: FC = () => {
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)
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
