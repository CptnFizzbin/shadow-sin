import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { isTechnomancer } from "#/components/runner/awakenings/technomancer/viewer/technomancerUtils.ts"
import { useSpritesAlerts } from "#/hooks/builder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

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
