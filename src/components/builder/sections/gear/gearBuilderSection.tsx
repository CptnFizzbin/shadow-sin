import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"

import { GearSection } from "./gearSection.tsx"
import { useGearAlerts } from "./useGearAlerts.ts"

export const GearBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.gear} alerts={useGearAlerts()}>
      <GearSection />
    </BuilderSection>
  )
}
