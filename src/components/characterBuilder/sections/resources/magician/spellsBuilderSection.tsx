import type { FC } from "react"

import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { SpellsList } from "#/components/characterBuilder/sections/resources/magician/spellsList.tsx"
import { useSpellsAlerts } from "#/components/characterBuilder/sections/resources/magician/useSpellsAlerts.ts"

export const SpellsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.spells} alerts={useSpellsAlerts()}>
      <SpellsList />
    </BuilderSection>
  )
}
