import { useAttributeAlerts } from "#/components/CharacterBuilder/Alerts/Hooks/UseAttributeAlerts.ts"
import { useBiologyAlerts } from "#/components/CharacterBuilder/Sections/Biology/UseBiologyAlerts.ts"
import { useBuildPointsAlerts } from "#/components/CharacterBuilder/Sections/BuildPoints/UseBuildPointsAlerts.ts"
import { useContactsAlerts } from "#/components/CharacterBuilder/Sections/Contacts/UseContactsAlerts.ts"
import { useGearAlerts } from "#/components/CharacterBuilder/Sections/Gear/UseGearAlerts.ts"
import { useProfileAlerts } from "#/components/CharacterBuilder/Sections/Profile/UseProfileAlerts.ts"
import { useQualitiesAlerts } from "#/components/CharacterBuilder/Sections/Qualities/UseQualitiesAlerts.ts"
import { useAwakenedAlerts } from "#/components/CharacterBuilder/Sections/Resources/UseAwakenedAlerts.ts"
import { useSkillsAlerts } from "#/components/CharacterBuilder/Sections/Skills/Hooks/UseSkillsAlerts.ts"
import { useSkillsSummaryAlerts } from "#/components/CharacterBuilder/Sections/Skills/Hooks/UseSkillsSummaryAlerts.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export function useAllAlerts(): AlertInfo[] {
  return [
    ...useProfileAlerts(),
    ...useBiologyAlerts(),
    ...useAttributeAlerts(),
    ...useQualitiesAlerts(),
    ...useSkillsSummaryAlerts(),
    ...useSkillsAlerts(),
    ...useAwakenedAlerts(),
    ...useGearAlerts(),
    ...useContactsAlerts(),
    ...useBuildPointsAlerts(),
  ]
}
