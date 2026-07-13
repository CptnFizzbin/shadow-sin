import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { SpritesList } from "./spritesList.tsx"
import {
  useSpritesAlerts,
} from "./useSpritesAlerts.ts"

export const SpritesBuilderSection: FC = () => {
  const awakeningType = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
  const alerts = useSpritesAlerts()

  if (!isTechnomancer(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.sprites} alerts={alerts}>
      <SpritesList />
    </BuilderSection>
  )
}
