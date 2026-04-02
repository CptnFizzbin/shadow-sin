import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { SpellsList } from "#/components/CharacterBuilder/Sections/Resources/Magician/SpellsList.tsx"
import { useSpellsAlerts } from "#/components/CharacterBuilder/Sections/Resources/Magician/UseSpellsAlerts.ts"

export const SpellsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.spells} alerts={useSpellsAlerts()}>
      <SpellsList />
    </BuilderSection>
  )
}
