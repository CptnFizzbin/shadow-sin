import type { FC } from "react"

import { useAttributeAlerts } from "#/components/CharacterBuilder/Alerts/Hooks/use-attribute-alerts.ts"
import { AttributesSection } from "#/components/CharacterBuilder/Sections/Attributes/attributes-section.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const AttributesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.attributes} alerts={useAttributeAlerts()}>
      <AttributesSection />
    </BuilderSection>
  )
}
