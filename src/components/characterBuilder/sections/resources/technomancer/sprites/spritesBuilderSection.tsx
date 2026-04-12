import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { SpritesList } from "#/components/characterBuilder/sections/resources/technomancer/sprites/spritesList.tsx"
import {
  useSpritesAlerts,
} from "#/components/characterBuilder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"
import { isTechnomancer } from "#/components/technomancer/technomancerUtils.ts"

export const SpritesBuilderSection: FC = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const alerts = useSpritesAlerts()

  if (!isTechnomancer(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.sprites} alerts={alerts}>
      <SpritesList />
    </BuilderSection>
  )
}
