import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { SpellsList } from "#/components/characterBuilder/sections/resources/magician/spellsList.tsx"
import { useSpellsAlerts } from "#/components/characterBuilder/sections/resources/magician/useSpellsAlerts.ts"
import { isMagician } from "#/components/spells/spellsUtils.ts"

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
