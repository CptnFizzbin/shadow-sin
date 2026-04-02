import { useAttributeAlerts } from "#/components/CharacterBuilder/Alerts/Hooks/UseAttributeAlerts.ts"
import { useBuildPointsAlerts } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseBuildPointsAlerts.ts"
import { useBiologyAlerts } from "#/components/CharacterBuilder/Sections/Biology/UseBiologyAlerts.ts"
import { useContactsAlerts } from "#/components/CharacterBuilder/Sections/Contacts/UseContactsAlerts.ts"
import { useGearAlerts } from "#/components/CharacterBuilder/Sections/Gear/UseGearAlerts.ts"
import { useProfileAlerts } from "#/components/CharacterBuilder/Sections/Profile/UseProfileAlerts.ts"
import { useQualitiesAlerts } from "#/components/CharacterBuilder/Sections/Qualities/UseQualitiesAlerts.ts"
import { useAdeptPowersAlerts } from "#/components/CharacterBuilder/Sections/Resources/Adept/UseAdeptPowersAlerts.ts"
import { useSpellsAlerts } from "#/components/CharacterBuilder/Sections/Resources/Magician/UseSpellsAlerts.ts"
import {
  useComplexFormsAlerts,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/UseComplexFormsAlerts.ts"
import { useSpritesAlerts } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/UseSpritesAlerts.ts"
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
    ...useSpellsAlerts(),
    ...useAdeptPowersAlerts(),
    ...useSpritesAlerts(),
    ...useComplexFormsAlerts(),
    ...useGearAlerts(),
    ...useContactsAlerts(),
    ...useBuildPointsAlerts(),
  ]
}
