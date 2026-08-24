import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import {
  selectSpritesAlerts,
} from "#/hooks/builder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"
import { useRunnerSelector, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { SpritesList } from "./spritesList.tsx"

export const SpritesBuilderSection: FC = () => {
  const awakeningType = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
  const alerts = useRunnerSelector(selectSpritesAlerts)

  if (!isTechnomancer(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.sprites} alerts={alerts}>
      <SpritesList />
    </BuilderSection>
  )
}
