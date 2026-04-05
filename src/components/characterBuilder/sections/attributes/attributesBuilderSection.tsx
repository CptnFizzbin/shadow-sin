import type { FC } from "react"

import { useAttributeAlerts } from "#/components/characterBuilder/alerts/hooks/useAttributeAlerts.ts"
import { AttributesSection } from "#/components/characterBuilder/sections/attributes/attributesSection.tsx"
import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"

export const AttributesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.attributes} alerts={useAttributeAlerts()}>
      <AttributesSection />
    </BuilderSection>
  )
}
