import type { FC } from "react"

import { BiologySection } from "#/components/CharacterBuilder/Sections/Biology/biology-section.tsx"
import { useBiologyAlerts } from "#/components/CharacterBuilder/Sections/Biology/use-biology-alerts.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const BiologyBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.biology} alerts={useBiologyAlerts()}>
      <BiologySection />
    </BuilderSection>
  )
}
