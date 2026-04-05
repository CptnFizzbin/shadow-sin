import type { FC } from "react"

import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { SpritesList } from "#/components/characterBuilder/sections/resources/technomancer/sprites/spritesList.tsx"
import {
  useSpritesAlerts,
} from "#/components/characterBuilder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"

export const SpritesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.sprites} alerts={useSpritesAlerts()}>
      <SpritesList />
    </BuilderSection>
  )
}
