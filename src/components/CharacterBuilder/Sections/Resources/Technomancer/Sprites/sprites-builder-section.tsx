import type { FC } from "react"

import { SpritesList } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/Sprites/sprites-list.tsx"
import {
  useSpritesAlerts,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/Sprites/use-sprites-alerts.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const SpritesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.sprites} alerts={useSpritesAlerts()}>
      <SpritesList />
    </BuilderSection>
  )
}
