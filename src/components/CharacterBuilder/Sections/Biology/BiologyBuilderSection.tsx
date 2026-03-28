import type { FC } from "react"

import { BiologySection } from "#/components/CharacterBuilder/Sections/Biology/BiologySection.tsx"
import { useBiologyAlerts } from "#/components/CharacterBuilder/Sections/Biology/UseBiologyAlerts.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"

export const BiologyBuilderSection: FC = () => {
  return (
    <BuilderSection title="Biology" alerts={useBiologyAlerts()}>
      <BiologySection />
    </BuilderSection>
  )
}
