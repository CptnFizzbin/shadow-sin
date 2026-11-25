import type { FC } from "react"

import { BuilderSection } from "#app/components/builder/builderSection.tsx"
import { ItemSelectionProvider } from "#app/components/entities/items/selection/itemSelectionProvider.tsx"
import { BuilderSectionId } from "#state/builder/builderSectionId.ts"
import { useGearAlerts } from "#state/builder/sections/gear/useGearAlerts.ts"

import { GearSection } from "./gearSection.tsx"

export const GearBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.gear} alerts={useGearAlerts()}>
      <ItemSelectionProvider>
        <GearSection />
      </ItemSelectionProvider>
    </BuilderSection>
  )
}
