import { useAttributeAlerts } from "#/components/CharacterBuilder/Sections/Attributes/UseAttributeAlerts.ts"
import { useBiologyAlerts } from "#/components/CharacterBuilder/Sections/Biology/UseBiologyAlerts.ts"
import { useContactsAlerts } from "#/components/CharacterBuilder/Sections/Contacts/UseContactsAlerts.ts"
import { useGearAlerts } from "#/components/CharacterBuilder/Sections/Gear/UseGearAlerts.ts"
import { useProfileAlerts } from "#/components/CharacterBuilder/Sections/Profile/UseProfileAlerts.ts"
import { useQualitiesAlerts } from "#/components/CharacterBuilder/Sections/Qualities/UseQualitiesAlerts.ts"
import { useAwakenedAlerts } from "#/components/CharacterBuilder/Sections/Resources/UseAwakenedAlerts.ts"
import { useSkillsAlerts } from "#/components/CharacterBuilder/Sections/Skills/Hooks/UseSkillsAlerts.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export function useAllAlerts(): AlertInfo[] {
  return [
    ...useProfileAlerts(),
    ...useBiologyAlerts(),
    ...useAttributeAlerts(),
    ...useQualitiesAlerts(),
    ...useSkillsAlerts(),
    ...useAwakenedAlerts(),
    ...useGearAlerts(),
    ...useContactsAlerts(),
  ]
}
