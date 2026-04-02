import type { FC } from "react"

import { useAttributeAlerts } from "#/components/CharacterBuilder/Alerts/Hooks/UseAttributeAlerts.ts"
import { AttributesSection } from "#/components/CharacterBuilder/Sections/Attributes/AttributesSection.tsx"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"

export const AttributesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.attributes} alerts={useAttributeAlerts()}>
      <AttributesSection />
    </BuilderSection>
  )
}
