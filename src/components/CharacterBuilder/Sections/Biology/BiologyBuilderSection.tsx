import type { FC } from "react"

import { BiologySection } from "#/components/CharacterBuilder/Sections/Biology/BiologySection.tsx"
import { useBiologyAlerts } from "#/components/CharacterBuilder/Sections/Biology/UseBiologyAlerts.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"

export const BiologyBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.biology} alerts={useBiologyAlerts()}>
      <BiologySection />
    </BuilderSection>
  )
}
