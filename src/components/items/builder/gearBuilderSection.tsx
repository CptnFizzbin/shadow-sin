import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { useGearAlerts } from "#/hooks/builder/sections/gear/useGearAlerts.ts"

import { GearSection } from "./gearSection.tsx"

export const GearBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.gear} alerts={useGearAlerts()}>
      <GearSection />
    </BuilderSection>
  )
}
