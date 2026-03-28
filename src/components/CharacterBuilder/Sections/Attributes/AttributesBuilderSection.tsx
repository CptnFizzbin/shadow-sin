import type { FC } from "react"

import { AttributesSection } from "#/components/CharacterBuilder/Sections/Attributes/AttributesSection.tsx"
import { useAttributeAlerts } from "#/components/CharacterBuilder/Sections/Attributes/UseAttributeAlerts.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"

export const AttributesBuilderSection: FC = () => {
  return (
    <BuilderSection title="Attributes" alerts={useAttributeAlerts()}>
      <AttributesSection />
    </BuilderSection>
  )
}
