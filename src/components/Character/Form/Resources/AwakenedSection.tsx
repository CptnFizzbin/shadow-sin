import type { FC, ReactNode } from "react"

import { useCharacterBuilderStore } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { AdeptPowersSection } from "#/components/Character/Form/Resources/Adept/AdeptPowersSection.tsx"
import { isAdept } from "#/components/Character/Form/Resources/Adept/AdeptPowersUtils.ts"
import { SpellsSection } from "#/components/Character/Form/Resources/Magician/SpellsSection.tsx"
import { isMagician } from "#/components/Character/Form/Resources/Magician/SpellsUtils.ts"
import { TechnomancerSection } from "#/components/Character/Form/Resources/Technomancer/TechnomancerSection.tsx"
import { isTechnomancer } from "#/components/Character/Form/Resources/Technomancer/TechnomancerUtils.ts"
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
