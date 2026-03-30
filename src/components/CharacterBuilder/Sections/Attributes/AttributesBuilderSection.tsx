import type { FC } from "react"

import { useAttributeAlerts } from "#/components/CharacterBuilder/Alerts/Hooks/UseAttributeAlerts.ts"
import { AttributesSection } from "#/components/CharacterBuilder/Sections/Attributes/AttributesSection.tsx"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"

export const AttributesBuilderSection: FC = () => {
  return (
    <BuilderSection title="Attributes" alerts={useAttributeAlerts()}>
      <AttributesSection />
    </BuilderSection>
  )
}
