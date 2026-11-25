import type { FC } from "react"

import { BuilderSection } from "#app/components/builder/builderSection.tsx"
import { isTechnomancer } from "#data/magic/technomancerUtils.ts"
import { BuilderSectionId } from "#state/builder/builderSectionId.ts"
import { useSpritesAlerts } from "#state/builder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"
import { BiologySelectors } from "#state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

import { SpritesList } from "./spritesList.tsx"

export const SpritesBuilderSection: FC = () => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const alerts = useSpritesAlerts()

  if (!isTechnomancer(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.sprites} alerts={alerts}>
      <SpritesList />
    </BuilderSection>
  )
}
