import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { isMagician } from "#/components/runner/spells/spellsUtils.ts"

import { SpellsList } from "./spellsList.tsx"
import { useSpellsAlerts } from "./useSpellsAlerts.ts"

export const SpellsBuilderSection: FC = () => {
  const awakeningType = useRunnerData((sheet) => sheet.biology.awakening)
  const alerts = useSpellsAlerts()

  if (!isMagician(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.spells} alerts={alerts}>
      <SpellsList />
    </BuilderSection>
  )
}
