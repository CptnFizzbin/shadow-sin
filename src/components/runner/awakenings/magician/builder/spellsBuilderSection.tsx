import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { isMagician } from "#/components/runner/awakenings/magician/viewer/magicianUtils.ts"
import { useSpellsAlerts } from "#/hooks/builder/sections/resources/magician/useSpellsAlerts.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { SpellsList } from "./spellsList.tsx"

export const SpellsBuilderSection: FC = () => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const alerts = useSpellsAlerts()

  if (!isMagician(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.spells} alerts={alerts}>
      <SpellsList />
    </BuilderSection>
  )
}
