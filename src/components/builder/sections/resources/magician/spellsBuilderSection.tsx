import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { isMagician } from "#/components/character/spells/spellsUtils.ts"

import { SpellsList } from "./spellsList.tsx"
import { useSpellsAlerts } from "./useSpellsAlerts.ts"

export const SpellsBuilderSection: FC = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const alerts = useSpellsAlerts()

  if (!isMagician(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.spells} alerts={alerts}>
      <SpellsList />
    </BuilderSection>
  )
}
