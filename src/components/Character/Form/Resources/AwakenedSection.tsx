import type { FC, ReactNode } from "react"

import { AdeptPowersList } from "#/components/Character/Form/Resources/Adept/AdeptPowersList.tsx"
import { isAdept } from "#/components/Character/Form/Resources/Adept/AdeptPowersUtils.ts"
import { SpellsList } from "#/components/Character/Form/Resources/Magician/SpellsList.tsx"
import { isMagician } from "#/components/Character/Form/Resources/Magician/SpellsUtils.ts"
import { TechnomancerSection } from "#/components/Character/Form/Resources/Technomancer/TechnomancerSection.tsx"
import { isTechnomancer } from "#/components/Character/Form/Resources/Technomancer/TechnomancerUtils.ts"
import { useBuilderStore } from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
import { AwakeningType } from "#/lib/system/types/awakeningType.ts"

export const AwakenedSection: FC = () => {
  const awakeningType = useBuilderStore((state) => state.awakening)
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
