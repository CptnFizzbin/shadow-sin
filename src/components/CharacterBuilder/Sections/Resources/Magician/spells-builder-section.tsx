import type { FC } from "react"

import { SpellsList } from "#/components/CharacterBuilder/Sections/Resources/Magician/spells-list.tsx"
import { useSpellsAlerts } from "#/components/CharacterBuilder/Sections/Resources/Magician/use-spells-alerts.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const SpellsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.spells} alerts={useSpellsAlerts()}>
      <SpellsList />
    </BuilderSection>
  )
}
