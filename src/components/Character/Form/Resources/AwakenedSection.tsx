import type { FC, ReactNode } from "react"

import { useCharacterBuilderStore } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { isAdept } from "#/components/Character/Form/Resources/Adept/AdeptPowerRequirements.ts"
import { AdeptPowersSection } from "#/components/Character/Form/Resources/Adept/AdeptPowersSection.tsx"
import { isMagician } from "#/components/Character/Form/Resources/Magician/SpellsRequirements.ts"
import { SpellsSection } from "#/components/Character/Form/Resources/Magician/SpellsSection.tsx"
import { isTechnomancer } from "#/components/Character/Form/Resources/Technomancer/TechnomancerRequirements.ts"
import { TechnomancerSection } from "#/components/Character/Form/Resources/Technomancer/TechnomancerSection.tsx"
import { AwakeningType } from "#/lib/system/types/awakeningType.ts"

export const AwakenedSection: FC = () => {
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)
  const sections: ReactNode[] = []

  if (isMagician(awakeningType)) {
    sections.push(<SpellsSection key={AwakeningType.Magician} />)
  }

  if (isAdept(awakeningType)) {
    sections.push(<AdeptPowersSection key={AwakeningType.Adept} />)
  }

  if (isTechnomancer(awakeningType)) {
    sections.push(<TechnomancerSection key={AwakeningType.Technomancer} />)
  }

  return sections
}
