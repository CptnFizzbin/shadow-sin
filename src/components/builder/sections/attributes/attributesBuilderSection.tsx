import type { FC } from "react"

import { useAttributeAlerts } from "#/components/builder/alerts/hooks/useAttributeAlerts.ts"
import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"

import { AttributesSection } from "./attributesSection.tsx"

export const AttributesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.attributes} alerts={useAttributeAlerts()}>
      <AttributesSection />
    </BuilderSection>
  )
}
