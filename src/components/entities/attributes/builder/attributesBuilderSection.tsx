import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { useAttributeAlerts } from "#/hooks/builder/alerts/useAttributeAlerts.ts"

import { AttributesSection } from "./attributesSection.tsx"

export const AttributesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.attributes} alerts={useAttributeAlerts()}>
      <AttributesSection />
    </BuilderSection>
  )
}
