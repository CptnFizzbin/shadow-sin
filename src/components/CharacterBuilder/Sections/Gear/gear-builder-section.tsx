import type { FC } from "react"

import { GearSection } from "#/components/CharacterBuilder/Sections/Gear/gear-section.tsx"
import { useGearAlerts } from "#/components/CharacterBuilder/Sections/Gear/use-gear-alerts.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const GearBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.gear} alerts={useGearAlerts()}>
      <GearSection />
    </BuilderSection>
  )
}
