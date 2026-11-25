import type { FC } from "react"

import { BuilderSection } from "#/app/components/builder/builderSection.tsx"
import { useAttributeAlerts } from "#/state/builder/alerts/useAttributeAlerts.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"

import { AttributesSection } from "./attributesSection.tsx"

export const AttributesBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.attributes} alerts={useAttributeAlerts()}>
      <AttributesSection />
    </BuilderSection>
  )
}
