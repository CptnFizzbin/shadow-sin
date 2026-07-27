import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isMagician } from "#/components/runner/magician/magicianUtils.ts"
import { useSpellsAlerts } from "#/lib/hooks/builder/sections/resources/magician/useSpellsAlerts.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

import { SpellsList } from "./spellsList.tsx"

export const SpellsBuilderSection: FC = () => {
  const awakeningType = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
  const alerts = useSpellsAlerts()

  if (!isMagician(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.spells} alerts={alerts}>
      <SpellsList />
    </BuilderSection>
  )
}
