import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { GearSection } from "#/components/CharacterBuilder/Sections/Gear/GearSection.tsx"
import { useGearAlerts } from "#/components/CharacterBuilder/Sections/Gear/UseGearAlerts.ts"

export const GearBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.gear} alerts={useGearAlerts()}>
      <GearSection />
    </BuilderSection>
  )
}
