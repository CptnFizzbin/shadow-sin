import type { FC } from "react"

import { useAttributeAlerts } from "#/components/builder/alerts/hooks/useAttributeAlerts.ts"
import { AttributesSection } from "#/components/builder/sections/attributes/attributesSection.tsx"
import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"

export const AttributesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.attributes} alerts={useAttributeAlerts()}>
      <AttributesSection />
    </BuilderSection>
  )
}
