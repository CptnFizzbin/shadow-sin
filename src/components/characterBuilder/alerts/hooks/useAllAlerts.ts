import { useAttributeAlerts } from "#/components/characterBuilder/alerts/hooks/useAttributeAlerts.ts"
import { useContactsAlerts } from "#/components/characterBuilder/alerts/hooks/useContactsAlerts.ts"
import { useBuildPointsAlerts } from "#/components/characterBuilder/buildPoints/hooks/useBuildPointsAlerts.ts"
import { useBiologyAlerts } from "#/components/characterBuilder/sections/biology/useBiologyAlerts.ts"
import { useGearAlerts } from "#/components/characterBuilder/sections/gear/useGearAlerts.ts"
import { useProfileAlerts } from "#/components/characterBuilder/sections/profile/useProfileAlerts.ts"
import { useQualitiesAlerts } from "#/components/characterBuilder/sections/qualities/useQualitiesAlerts.ts"
import { useAdeptPowersAlerts } from "#/components/characterBuilder/sections/resources/adept/useAdeptPowersAlerts.ts"
import { useSpellsAlerts } from "#/components/characterBuilder/sections/resources/magician/useSpellsAlerts.ts"
import {
  useComplexFormsAlerts,
} from "#/components/characterBuilder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import {
  useSpritesAlerts,
} from "#/components/characterBuilder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"
import { useSkillsAlerts } from "#/components/characterBuilder/sections/skills/hooks/useSkillsAlerts.ts"
import { useSkillsSummaryAlerts } from "#/components/characterBuilder/sections/skills/hooks/useSkillsSummaryAlerts.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

/**
 * Aggregates alert information from every character-builder section in a fixed order.
 *
 * @returns An array of `AlertInfo` objects containing alerts from profile, biology, attributes, qualities, skills summary, skills, spells, adept powers, sprites, complex forms, gear, contacts, and build points, in that order.
 */
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
