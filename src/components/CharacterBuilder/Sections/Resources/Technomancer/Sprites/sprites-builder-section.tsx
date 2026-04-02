import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { SpritesList } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/Sprites/SpritesList.tsx"
import {
  useSpritesAlerts,
} from '#/components/CharacterBuilder/Sections/Resources/Technomancer/Sprites/use-sprites-alerts.ts"

export const SpritesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.sprites} alerts={useSpritesAlerts()}>
      <SpritesList />
    </BuilderSection>
  )
}
