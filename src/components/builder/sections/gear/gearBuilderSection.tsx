import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { useGearAlerts } from "#/hooks/builder/sections/gear/useGearAlerts.ts"

import { GearSection } from "./gearSection.tsx"

export const GearBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.gear} alerts={useGearAlerts()}>
      <GearSection />
    </BuilderSection>
  )
}
